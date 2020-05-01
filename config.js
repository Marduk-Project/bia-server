const nconf = require('nconf');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// workaround cli sequelize migration
let argParam = process.argv[4];
if (!argParam) {
  argParam = 'development';
} else {
  if (
    argParam != 'development' &&
    argParam != 'test' &&
    argParam != 'production'
  ) {
    argParam = 'development';
  }
}

// env
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = argParam;
}

// load conf
const filepath = path.join(__dirname, `cfg_${process.env.NODE_ENV}.json`);
if (fs.existsSync(filepath)) {
  nconf.file(filepath).env().argv();
} else {
  nconf.env().argv();
}

exports.env = process.env.NODE_ENV;
exports.nconf = nconf;
exports.filepath = filepath;

// console.log(chalk.green(`Running on environment: ${env}`)); // manter apenas para debug
