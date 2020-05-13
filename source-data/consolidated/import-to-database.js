const config = require('../../config');
const chalk = require('chalk');
const {
  checkIsConnected,
  mainDb,
} = require('../../server/database/main_connection.js');

const { model: CountryModel } = require('../../server/models/gl_country');
const { model: StateModel } = require('../../server/models/gl_state');
const { model: CityModel } = require('../../server/models/gl_city');
const StateRegionModelModule = require('../../server/models/gl_state_region');
const StateRegionModel = StateRegionModelModule.model;
const CityStateRegionModelModule = require('../../server/models/gl_city_state_region');
const CityStateRegionModel = CityStateRegionModelModule.model;

const models = {
  glCity: CityModel,
  orOrderConsolidated: '',
  glProduct: '',
  glUnit: '',
  glPerson: '',
  glPersonType: '',
};

const rawData = require('./consolidated.json');
const schemaMapToDB = require('./schema-map-to-db');
const idsByModel = {};

exports.importToDatabase = async keepConnection => {
  try {
    let count = 0;
    let lastMessageCount = 0;

    const incLogFunc = () => {
      count++;
      if (lastMessageCount + 100 < count) {
        lastMessageCount += 100;
        console.log(chalk.green(`...processed ${lastMessageCount} rows...`));
      }
    };

    console.log(chalk.green('Connecting to DB...'));
    await checkIsConnected();

    console.log(chalk.green('Preparing data to be imported...'));
    const preparedData = rawData.map(prepareDataForRow);

    console.log(
      chalk.green('Starting to import... it might take some time...')
    );

    console.log(chalk.green(`Created ...`));
    incLogFunc();
  } catch (err) {
    console.log(chalk.red('Error on importing data...'), err);
  }
};

function prepareDataForRow(row) {
  Object.keys(row).forEach(key => {
    if (schemaMapToDB[key].parse) {
      row[key] = schemaMapToDB[key].parse(row[key]);
    }
    if (schemaMapToDB[key].idField) {
      row[key] = getId(row[key], schemaMapToDB[key]);
    }
  });
  return row;
}

async function getId(value, schemaMap) {
  if (!idsByModel[schemaMap.modelName][value]) {
    idsByModel[schemaMap.modelName][value] = await getFromModel(
      schemaMap.modelName,
      {
        [schemaMap.modelField]: value,
      }
    );
  }

  return idsByModel[schemaMap.modelName][value];
}
async function getFromModel(modelName, where) {
  const value = Object.values(where)[0];

  const { id } = await models[modelName].find({
    where,
  });

  return id;
}
