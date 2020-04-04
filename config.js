const nconf = require('nconf');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// env
let env = process.env.NODE_ENV || process.argv[4];
if (!env) {
  env = "development";
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = env;
}

// load conf
const filepath = path.join(__dirname, `cfg_${env}.json`);
if (fs.existsSync(filepath)) {
  nconf.file(filepath).env().argv();
} else {
  nconf.env().argv();
}

exports.env = env;
exports.nconf = nconf;
exports.filepath = filepath;

// console.log(chalk.green(`Running on environment: ${env}`)); // manter apenas para debug