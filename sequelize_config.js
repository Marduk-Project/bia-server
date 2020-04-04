const nconf = require('nconf');
const config = require('./config.js'); // necessario

module.exports = {
  development: {
    username: nconf.get('MAINDB_USERNAME'),
    password: nconf.get('MAINDB_PASSWORD'),
    database: nconf.get('MAINDB_DATABASE'),
    host: nconf.get('MAINDB_HOST'),
    port: nconf.get('MAINDB_PORT'),
    dialect: nconf.get('MAINDB_DIALECT'),
    migrationStorageTableName: "sy_sequelize_meta",
  },
  test: {
    username: nconf.get('MAINDB_USERNAME'),
    password: nconf.get('MAINDB_PASSWORD'),
    database: nconf.get('MAINDB_DATABASE'),
    host: nconf.get('MAINDB_HOST'),
    port: nconf.get('MAINDB_PORT'),
    dialect: nconf.get('MAINDB_DIALECT'),
    migrationStorageTableName: "sy_sequelize_meta",
  },
  production: {
    username: nconf.get('MAINDB_USERNAME'),
    password: nconf.get('MAINDB_PASSWORD'),
    database: nconf.get('MAINDB_DATABASE'),
    host: nconf.get('MAINDB_HOST'),
    port: nconf.get('MAINDB_PORT'),
    dialect: nconf.get('MAINDB_DIALECT'),
    migrationStorageTableName: "sy_sequelize_meta",
  }
};
