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
  findOrCreateOrder,
  createOrAddOrderProduct,
} = require('./db-finders-and-creators');

const {
  incLog,
  setLogFile,
  addToLogFile,
  LOG_TYPE,
} = require('../import_utils');
setLogFile('./consolidated.log');

const dataList = require('./consolidated.json');
const numRows = dataList.length;

exports.importToDatabase = async keepConnection => {
  try {
    let count = 0;

    console.log(chalk.green('Connecting to DB...'));
    await checkIsConnected();

    console.log(chalk.green('Preparing data to be imported...'));

    console.log(
      chalk.green('Starting to import... it might take some time...')
    );

    for (let rowNumber = 0; rowNumber < numRows; rowNumber++) {
      const data = dataList[rowNumber];

      try {
        // City
        const cityId = await findOrCreatePersonType(data.cityName);
        data.cityId = cityId;
        delete data.cityName;

        // PersonType
        data.personTypeId = await findOrCreatePersonType(
          data.personType,
          data.personTypePriority
        );
        delete data.personType;
        delete data.personTypePriority;

        // Person
        data.personDestinationId = await findOrCreatePerson(
          data.personName,
          data.cityId,
          data.personPriority
        );
        delete data.personName;
        delete data.personPriority;

        // Unit
        data.unitId = await findOrCreateUnit(data.unitName);
        delete data.unitName;

        // Product
        data.productId = await findOrCreateProduct(
          data.productName,
          data.unitId,
          data.isConsumable
        );
        delete data.productName;
        delete data.unitId;
        delete data.isConsumable;

        // Order
        data.orderId = await findOrCreateOrder(data.personDestinationId);
        delete data.personDestinationId;

        // Order Product
        data.orderId = await createOrAddOrderProduct({
          orderId: data.orderId,
          productId: data.productId,
          unitId: data.unitId,
          quantity: data.quantity,
          notes: data.notes,
          requestQuantity: data.requestQuantity,
        });
        delete data.orderId;
        delete data.productId;
        delete data.unitId;
        delete data.quantity;

        console.log(chalk.green(`Created ...`));
        incLog(count++);
      } catch (errorMessage) {
        console.log(chalk.red(`Error on index ${rowNumber}`), errorMessage);
        console.log('data:', data);
        addToLogFile(
          LOG_TYPE.ERROR,
          `
          ${errorMessage}
          dataIndex: ${rowNumber}
          dataObject: ${data}
          `
        );
      }
    }
  } catch (errorMessage) {
    console.log(chalk.red('Error on importing data...'), errorMessage);
    addToLogFile(
      LOG_TYPE.ERROR,
      `
      ${errorMessage}
      `
    );
  }
};
