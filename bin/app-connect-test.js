const program = require('commander');
const config = require('../config');
const chalk = require('chalk');
const { handleError, mainDbEndFinally } = require('./common');

const run = async () => {
  try {
    program.outputHelp();
    await mainDbEndFinally();
  } catch (e) {
    handleError(e);
  }
}

program.action(run);

try {
  program.parse(process.argv);
} catch (e) {
  handleError(e);
  mainDbEndFinally();
}
