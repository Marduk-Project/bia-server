const config = require('../../config');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const {
  checkIsConnected,
  mainDb,
} = require('../../server/database/main_connection.js');

const { incLog, setLogFile, saveOnLog, LOG_TYPE } = require('../import_utils');

const { findCityForBRA } = require('../db_utils');

const { findOrCreatePerson } = require('../db_utils');

const logFilePath = path.join(__dirname, 'log.log');
setLogFile(logFilePath);

/**
 * @param {Boolean} keepConnection
 * @param {Array} dataList
 * @param {Boolean} ignoreLogFile
 */
exports.importToDatabase = async (keepConnection, dataList, ignoreLogFile) => {
  if (!dataList) {
    dataList = require('./entity-list.json');
  }
  console.log(chalk.green('Connecting to DB...'));
  await checkIsConnected();
  console.log(chalk.green('Preparing data to be imported...'));
  console.log(
    chalk.green(
      `Starting to import ${dataList.length} rows... it might take some time...`
    )
  );
  const { model: CityModel } = require('../../server/models/gl_city');
  const {
    model: PersonTypeModel,
  } = require('../../server/models/gl_person_type');
  try {
    if (fs.existsSync(logFilePath)) {
      console.log(chalk.green(`Log file cleared: ${logFilePath}.`));
      fs.unlinkSync(logFilePath);
    }
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
        // PersonType
        let personTypeEntity = null;
        if (data.entityType) {
          const [entity, created] = await PersonTypeModel.findOrCreate({
            where: {
              name: data.entityType,
            },
            defaults: {
              priority: data.priorityCovid ? 1 : 0,
            },
          });
          personTypeEntity = entity;
          if (personTypeEntity.priority != (data.priorityCovid ? 1 : 0)) {
            console.log(
              chalk.yellow(
                `${personTypeEntity.name} has differente priority level on import.`
              )
            );
          }
        }
        // Person Parent
        if (data.parentEntityName) {
          data.personParentId = await findOrCreatePerson({
            name: data.name,
            cityId: cityEntity.id,
            priority: data.priorityLevel,
            personTypeId: null,
            personParentId: null,
          });
        } else {
          data.personParentId = null;
        }
        // Person
        data.personId = await findOrCreatePerson({
          name: data.name,
          cityId: cityEntity.id,
          priority: data.priorityLevel,
          personTypeId: personTypeEntity.id,
          personParentId: data.personParentId,
        });
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
