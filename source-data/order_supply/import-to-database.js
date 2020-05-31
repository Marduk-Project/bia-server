const config = require('../../config');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const {
  checkIsConnected,
  mainDb,
} = require('../../server/database/main_connection.js');

const { incLog, setLogFile, saveOnLog, LOG_TYPE } = require('../import_utils');

const {
  findCityForBRA,
  findOrCreateOrder,
  orderConsolidateByPersonIdList,
} = require('../db_utils');

const logFilePath = path.join(__dirname, 'log.log');
setLogFile(logFilePath);

/**
 * @param {Boolean} keepConnection
 * @param {Array} dataList
 * @param {Boolean} ignoreLogFile
 */
exports.importToDatabase = async (keepConnection, dataList, ignoreLogFile) => {
  if (!dataList) {
    dataList = require('./data-list.json');
  }
  console.log(chalk.green('Connecting to DB...'));
  await checkIsConnected();
  console.log(chalk.green('Preparing data to be imported...'));
  console.log(
    chalk.green(
      `Starting to import ${dataList.length} rows... it might take some time...`
    )
  );
  const OrderModelModule = require('../../server/models/or_order');
  const OrderModel = OrderModelModule.model;
  const {
    model: OrderProductModel,
  } = require('../../server/models/or_order_product');
  const { model: PersonModel } = require('../../server/models/gl_person');
  const { model: ProductModel } = require('../../server/models/gl_product');
  const personDestinationUpdatedList = [];
  try {
    if (fs.existsSync(logFilePath)) {
      console.log(chalk.green(`Log file cleared: ${logFilePath}.`));
      fs.unlinkSync(logFilePath);
    }
    // clear all request orders
    console.log(chalk.red('... deleting all supply orders!'));
    const list = await OrderModel.findAll({
      where: {
        type: OrderModelModule.common.TYPE_SUPPLY,
      },
    });
    await Promise.all(
      list.map(async item => {
        await item.destroy();
      })
    );
    let count = 0;
    for (let rowNumber = 0; rowNumber < dataList.length; rowNumber++) {
      const data = dataList[rowNumber];
      try {
        // City
        const cityEntity = await findCityForBRA(data.city, data.state);
        if (!cityEntity) {
          throw new Error(
            `City "${data.city}" NOT FOUND in state ${data.state}, entity: ${data.name}`
          );
        }
        // City Origin
        const cityOriginEntity = await findCityForBRA(
          data.originCity,
          data.originState
        );
        if (!cityOriginEntity) {
          throw new Error(
            `City Origin "${data.originCity}" NOT FOUND in state ${data.originState}, entity: ${data.name}`
          );
        }
        // person
        const personEntity = await PersonModel.findOne({
          where: {
            name: {
              [Op.like]: data.name,
            },
            cityId: cityEntity.id,
          },
        });
        if (!personEntity) {
          throw new Error(
            `Person "${data.name}" NOT FOUND in city ${cityEntity.name}`
          );
        }
        // person origin
        const personOriginEntity = await PersonModel.findOne({
          where: {
            name: {
              [Op.like]: data.originName,
            },
            cityId: cityOriginEntity.id,
          },
        });
        if (!personOriginEntity) {
          throw new Error(
            `PersonOrigin "${data.originName}" NOT FOUND in city ${cityEntity.originCity}`
          );
        }
        // product
        const productEntity = await ProductModel.findOne({
          where: {
            name: data.productName,
          },
        });
        if (!productEntity) {
          throw new Error(`Product "${data.productName}" NOT FOUND`);
        }
        // include person on changed list
        if (!personDestinationUpdatedList.includes(personEntity.id)) {
          personDestinationUpdatedList.push(personEntity.id);
        }
        const effectiveDate = data.effectiveDate
          ? new Date(data.effectiveDate)
          : new Date();
        // Order
        data.orderId = await findOrCreateOrder(
          personEntity.id,
          false,
          effectiveDate,
          personOriginEntity.id
        );
        data.orderEntity = await OrderModel.findByPk(data.orderId);
        // Order Product
        const existingOrderProduct = await OrderProductModel.findByProduct(
          data.orderId,
          productEntity
        );
        data.orderProduct = await OrderProductModel.saveOrderProduct(
          {
            order: data.orderEntity,
            product: productEntity,
          },
          {
            quantity:
              data.qty +
              (existingOrderProduct ? existingOrderProduct.quantity : 0),
            notes: null,
          }
        );
        // log
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
    try {
      console.log(chalk.green('Consolidating...'));
      await orderConsolidateByPersonIdList(personDestinationUpdatedList);
    } catch (errorMessage) {
      console.log(chalk.red(`Error ${errorMessage}`), errorMessage);
      if (!ignoreLogFile) {
        saveOnLog(
          LOG_TYPE.ERROR,
          `
          ${errorMessage}`
        );
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
