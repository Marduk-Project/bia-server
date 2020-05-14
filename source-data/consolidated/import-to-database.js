const config = require('../../config');
const chalk = require('chalk');
const {
  checkIsConnected,
  mainDb,
} = require('../../server/database/main_connection.js');

const {
  findCity,
  findOrCreatePersonType,
  findOrCreatePerson,
  findOrCreateUnit,
  findOrCreateProduct,
} = require('./db-finders-and-creators');

const rawData = require('./consolidated.json');
const schemaMapToDB = require('./schema-map-to-db');

exports.importToDatabase = async keepConnection => {
  try {
    let count = 0;

    console.log(chalk.green('Connecting to DB...'));
    await checkIsConnected();

    console.log(chalk.green('Preparing data to be imported...'));
    const preparedData = rawData.map(prepareDataForRow);

    console.log(
      chalk.green('Starting to import... it might take some time...')
    );

    preparedData.forEach(async (data, rowNumber) => {
      try {
        // City
        const cityId = await findOrCreatePersonType(data.cityName);
        data.cityId = cityId;
        delete data.cityName;

        // PersonType
        data.personTypeId = await findOrCreatePersonType(
          data.personType,
          data.isCovid19Priority
        );
        delete data.personType, delete data.isCovid19Priority;

        // Person
        data.personDestinationId = await findOrCreatePerson(
          data.personName,
          data.cityId,
          data.covid19Priority
        );
        delete data.personName, delete data.covid19Priority;

        // Unit
        data.unitId = findOrCreateUnit(data.unitName);
        delete data.unitName;

        // Product
        data.productId = findOrCreateProduct(data.productName);
        delete data.productName;
      } catch (errorMessage) {
        console.log(chalk.red(`Error on index ${rowNumber}`), errorMessage);
        console.log('preparedDataRow:', data);
        // TODO: save on error log
      }

      console.log(chalk.green(`Created ...`));
      incLogFunc(++count);
    });
  } catch (err) {
    console.log(chalk.red('Error on importing data...'), err);
  }
};

function prepareDataForRow(row) {
  Object.keys(row).forEach(key => {
    if (schemaMapToDB[key].parse) {
      row[key] = schemaMapToDB[key].parse(row[key]);
    }
  });
  return row;
}

// Utils
// ---
let lastMessageCount = 0;
function incLogFunc(count) {
  if (lastMessageCount + 100 < count) {
    lastMessageCount += 100;
    console.log(chalk.green(`...processed ${lastMessageCount} rows...`));
  }
}
