const program = require('commander');
const config = require('../config');
const chalk = require('chalk');
const { handleError, mainDbEndFinally } = require('./common');

const run = () => {
  console.log(chalk.green('This command works! Hello world :)'));
};

program.option('-p <params>', 'params name').action(run);

try {
  program.parse(process.argv);
} catch (e) {
  handleError(e);
  mainDbEndFinally();
}
