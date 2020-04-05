const chalk = require('chalk');
const validator = require('validator');
const config = require('../config');

/**
 * Output an exception
 * @param {Exception} e
 */
const handleError = (e) => {
  console.log(chalk.red(`Error: ${e.message}\n`), e);
}

const outputNotRunned = (program) => {
  console.log(chalk.red('check required arguments.'));
  program.outputHelp();
}

const mainDbEndFinally = async () => {
  const { mainDb, checkIsConnected } = require('../server/database/main_connection');
  try {
    if (await checkIsConnected()) {
      await mainDb.close();
      console.log(chalk.green('Database closed!'));
    }
  } catch (err) {
    console.error(chalk.red('Database close error: ' + `${err}`));
  }
}

/**
 * Generates random int
 * @param {number} max inclusive
 */
const rand = (max) => {
  max = max || Number.MAX_SAFE_INTEGER;
  return Math.floor(Math.random() * max);
}

module.exports = {
  handleError: handleError,
  rand: rand,
  mainDbEndFinally: mainDbEndFinally,
  outputNotRunned: outputNotRunned,
}
