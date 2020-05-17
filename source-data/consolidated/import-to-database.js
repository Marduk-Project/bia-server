const config = require('../../config');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const {
  checkIsConnected,
  mainDb,
} = require('../../server/database/main_connection.js');

const {
  findOrCreatePerson,
  findOrCreateUnit,
  findOrCreateProduct,
  findOrCreateOrder,
} = require('./db-finders-and-creators');

const { incLog, setLogFile, saveOnLog, LOG_TYPE } = require('../import_utils');

const logFilePath = path.join(__dirname, 'consolidated.log');
setLogFile(logFilePath);

const TEST_MODE = false;

/**
 * @param {Boolean} keepConnection
 * @param {Array} dataList
 * @param {Boolean} ignoreLogFile
 */
exports.importToDatabase = async (keepConnection, dataList, ignoreLogFile) => {
  if (!dataList) {
    dataList = require('./consolidated.json');
  }
  const numRows = dataList.length;
  if (TEST_MODE) {
    console.log(chalk.red('!!! RUNNING ON TEST MODE !!! ATENTION !!!'));
  }
  const { model: CountryModel } = require('../../server/models/gl_country');
  const { model: StateModel } = require('../../server/models/gl_state');
  const { model: CityModel } = require('../../server/models/gl_city');
  const { model: UnitModel } = require('../../server/models/gl_unit');
  const { model: OrderModel } = require('../../server/models/or_order');
  const { model: ProductModel } = require('../../server/models/gl_product');
  const {
    model: OrderProductModel,
  } = require('../../server/models/or_order_product');
  const {
    model: PersonTypeModel,
  } = require('../../server/models/gl_person_type');
  try {
    if (fs.existsSync(logFilePath)) {
      console.log(chalk.green(`Log file cleared: ${logFilePath}.`));
      fs.unlinkSync(logFilePath);
    }
    // test
    if (TEST_MODE) {
      console.log(chalk.red('... deleting all orders!'));
      const list = await OrderModel.findAll();
      await Promise.all(
        list.map(async item => {
          await item.destroy();
        })
      );
    }
    // country
    let [countryEntity, countryCreated] = await CountryModel.findOrCreate({
      where: {
        code: 'BRA',
      },
      defaults: {
        name: 'Brasil',
        priority: 1,
      },
    });
    // state RS
    let [stateEntity, stateCreated] = await StateModel.findOrCreate({
      where: {
        code: '43',
        countryId: countryEntity.id,
      },
      defaults: {
        name: 'Rio Grande do Sul',
        initials: 'RS',
        priority: 1,
      },
    });
    // liter
    const [literEntity, literCreated] = await UnitModel.findOrCreate({
      where: {
        unit: 'L',
      },
      defaults: {
        name: 'Litro(s)',
        nameSingular: 'Litro',
        namePlural: 'Litros',
      },
    });
    if (literCreated) {
      console.log(chalk.green('Created Litro(s) [L] unit.'));
    }
    // unit
    const [unitEntity, unitCreated] = await UnitModel.findOrCreate({
      where: {
        unit: 'UN',
      },
      defaults: {
        name: 'Unidade(s)',
        nameSingular: 'Unidade',
        namePlural: 'Unidades',
      },
    });
    if (unitCreated) {
      console.log(chalk.green('Created Unidade(s) [UN] unit.'));
    }

    let count = 0;
    const personDestinationUpdatedList = [];

    console.log(chalk.green('Connecting to DB...'));
    await checkIsConnected();
    console.log(chalk.green('Preparing data to be imported...'));
    console.log(
      chalk.green(
        `Starting to import ${dataList.length} rows... it might take some time...`
      )
    );

    for (let rowNumber = 0; rowNumber < numRows; rowNumber++) {
      const data = dataList[rowNumber];
      try {
        if (!data.cityName) {
          if (!ignoreLogFile) {
            saveOnLog(
              LOG_TYPE.ERROR,
              `
            "cityName" not found in dataIndex: ${rowNumber}
            dataObject: ${JSON.stringify(data, null, 2)}
            `
            );
          }
          continue;
        }
        // City
        const cityEntity = await CityModel.findOne({
          where: {
            stateId: stateEntity.id,
            name: data.cityName,
          },
        });
        if (!cityEntity) {
          throw new Error(
            `City "${data.cityName}" NOT FOUND in state ${stateEntity.name}.`
          );
        }
        data.cityId = cityEntity.id;
        // PersonType
        let personTypeEntity = null;
        if (data.personType) {
          personTypeEntity = await PersonTypeModel.findOne({
            where: {
              name: data.personType,
            },
          });
        }
        if (!personTypeEntity) {
          personTypeEntity = await PersonTypeModel.findOrCreate({
            where: {
              name: 'DESCONHECIDO',
            },
          });
        }
        // Person
        data.personDestinationId = await findOrCreatePerson(
          data.personName,
          data.cityId,
          data.personPriority
        );

        data.unitId = data.unitName.toLowerCase().includes('litro')
          ? literEntity.id
          : unitEntity.id;
        // Product
        data.productId = await findOrCreateProduct(
          data.productName,
          data.unitId,
          data.isConsumable
        );
        data.productEntity = await ProductModel.findByPk(data.productId);

        // include person on changed list
        if (!personDestinationUpdatedList.includes(data.personDestinationId)) {
          personDestinationUpdatedList.push(data.personDestinationId);
        }

        // Order
        data.orderId = await findOrCreateOrder(data.personDestinationId);
        data.orderEntity = await OrderModel.findByPk(data.orderId);

        // Order Product
        data.orderProduct = await OrderProductModel.saveOrderProduct(
          {
            order: data.orderEntity,
            product: data.productEntity,
          },
          {
            quantity: data.requestQuantity,
            notes: data.orderProductNotes,
          }
        );
        count = incLog(count);
      } catch (errorMessage) {
        console.log(chalk.red(`Error on index ${rowNumber}`), errorMessage);
        console.log('data:', data);
        if (!ignoreLogFile) {
          saveOnLog(
            LOG_TYPE.ERROR,
            `
          ${errorMessage}
          dataIndex: ${rowNumber}
          dataObject: ${data}
          `
          );
        }
      }
    }
    if (!keepConnection) {
      await mainDb.close();
    }
    console.log(chalk.green('Done!'));
  } catch (errorMessage) {
    console.log(chalk.red('Error on importing data...'), errorMessage);
    if (!ignoreLogFile) {
      saveOnLog(
        LOG_TYPE.ERROR,
        `
      ${errorMessage}
      `
      );
    }
  }
};
