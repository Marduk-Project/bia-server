const fs = require('fs');
const chalk = require('chalk');
const { Op } = require('sequelize');

// General utils
exports.stringify = stringify;
function stringify(content) {
  return JSON.stringify(content, null, 2);
}
/**
 * Show increment log
 * @param {int} count
 * @param {[int=undefined]} divisor
 */
exports.incLog = (count, divisor) => {
  if (!count) {
    count = 0;
  }
  if (!divisor) {
    divisor = 100;
  }
  if (count % divisor == 0) {
    console.log(chalk.green(`...processed ${count} rows...`));
  }
  return count + 1;
};

// Database utils
exports.find = find;
async function find(Model, { where, notFound }) {
  throwErrorOnWhereFieldsEmpty(Model.getTableName(), where, Model);

  try {
    const preparedWhere = Object.keys(where).reduce((preparedWhere, key) => {
      if (key === 'name') {
        preparedWhere.name = {
          [Op.iLike]: where[key],
        };
      } else {
        preparedWhere[key] = where[key];
      }
      return preparedWhere;
    }, {});

    const objectsFound = await Model.findAll({ preparedWhere });

    if (objectsFound.length === 1) {
      return objectsFound[0].id;
    } else if (objectsFound.length > 1) {
      throwError(
        `Multiple results found.
        Where: ${stringify(where)}
        Results: ${stringify(objectsFound)}`,
        Model
      );
    } else {
      console.log(
        chalk.yellow(
          `No results found: ${Model.getTableName()} - where: ${stringify(
            where
          )}`
        )
      );

      if (typeof notFound === 'function') {
        return notFound();
      }
    }
  } catch (errorMessage) {
    throwError(errorMessage, Model);
  }
}

exports.create = create;
async function create(Model, data) {
  try {
    const createdObject = await Model.create(data);
    console.log(
      chalk.green(`Created on ${Model.getTableName()}: ${stringify(data)}`)
    );
    return createdObject.id;
  } catch (errorMessage) {
    throwError(errorMessage, Model);
  }
}

// Throwing errors utils
exports.throwErrorOnWhereFieldsEmpty = throwErrorOnWhereFieldsEmpty;
function throwErrorOnWhereFieldsEmpty(stepName, where, Model) {
  Object.values(where).forEach((value, index) => {
    if (value === undefined) {
      throwError(
        `Step: ${stepName}
        Parameter: ${Object.keys(where)[index]} blank.`,
        Model
      );
    }
  });
}

exports.throwError = throwError;
function throwError(message, Model) {
  console.log(
    chalk.red(
      `Error on Model: ${Model.getTableName()}
      ${message}
      Skipping this entry...`
    )
  );
  throw new Error(message);
}

// Log file
let logFilePath = './errors-and-warnings.log';
exports.LOG_TYPE = { ERROR: 'ERROR', WARNING: 'WARNING' };

exports.setLogFile = setLogFile;
function setLogFile(filepath) {
  logFilePath = filepath;
}

exports.saveOnLog = this.saveOnLog;
function saveOnLog(logType, message) {
  fs.appendFileSync(
    logFilePath,
    `\n---
    ${new Date().toISOString()} - ${logType.toUpperCase()}
    ${message}`
  );
}
