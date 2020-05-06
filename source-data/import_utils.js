const chalk = require('chalk');

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
