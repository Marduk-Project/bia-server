const chalk = require('chalk');

exports.mainDbEndTest = async () => {
  const { mainDb, checkIsConnected } = require('../database/mainConnection');
  try {
    if (await checkIsConnected()) {
      await mainDb.close();
      console.log(chalk.green('Database closed!'));
    }
  } catch (err) {
    console.error(chalk.red('Database close error: ' + `${err}`));
  }
}
