const nconf = require('nconf');
const config = require('./config.js'); // necessario

const useSSL =
  typeof nconf.get('MAINDB_SSL') == 'boolean'
    ? nconf.get('MAINDB_SSL')
    : nconf.get('MAINDB_SSL') == 'true';

module.exports = {
  development: {
    username: nconf.get('MAINDB_USERNAME'),
    password: nconf.get('MAINDB_PASSWORD'),
    database: nconf.get('MAINDB_DATABASE'),
    host: nconf.get('MAINDB_HOST'),
    port: nconf.get('MAINDB_PORT'),
    dialect: nconf.get('MAINDB_DIALECT'),
    migrationStorageTableName: 'sy_sequelize_meta',
    ssl: useSSL,
    dialectOptions: {
      ssl: useSSL,
    },
  },
  test: {
    username: nconf.get('MAINDB_USERNAME'),
    password: nconf.get('MAINDB_PASSWORD'),
    database: nconf.get('MAINDB_DATABASE'),
    host: nconf.get('MAINDB_HOST'),
    port: nconf.get('MAINDB_PORT'),
    dialect: nconf.get('MAINDB_DIALECT'),
    migrationStorageTableName: 'sy_sequelize_meta',
    ssl: useSSL,
    dialectOptions: {
      ssl: useSSL,
    },
  },
  production: {
    username: nconf.get('MAINDB_USERNAME'),
    password: nconf.get('MAINDB_PASSWORD'),
    database: nconf.get('MAINDB_DATABASE'),
    host: nconf.get('MAINDB_HOST'),
    port: nconf.get('MAINDB_PORT'),
    dialect: nconf.get('MAINDB_DIALECT'),
    migrationStorageTableName: 'sy_sequelize_meta',
    ssl: useSSL,
    dialectOptions: {
      ssl: useSSL,
    },
  },
};
