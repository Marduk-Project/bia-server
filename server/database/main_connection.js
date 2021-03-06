const chalk = require('chalk');
const nconf = require('nconf');
const { Sequelize, Op } = require('sequelize');

const useSSL =
  typeof nconf.get('MAINDB_SSL') == 'boolean'
    ? nconf.get('MAINDB_SSL')
    : nconf.get('MAINDB_SSL') == 'true';

const database = new Sequelize({
  dialect: nconf.get('MAINDB_DIALECT'),
  host: nconf.get('MAINDB_HOST'),
  port: nconf.get('MAINDB_PORT'),
  database: nconf.get('MAINDB_DATABASE'),
  username: nconf.get('MAINDB_USERNAME'),
  password: nconf.get('MAINDB_PASSWORD'),
  sync: { force: false },
  define: {
    freezeTableName: true,
    timestamps: true,
  },
  timezone: '+00:00', // store in gmt 0
  logging:
    process.env.NODE_ENV == 'development'
      ? sql => {
          console.log(chalk.yellow(`\n${sql}\n`));
        }
      : false,
  omitNull: true,
  ssl: useSSL,
  dialectOptions: {
    ssl: useSSL,
  },
});

let connectionWasTryed = false;

console.log(
  chalk.green(
    `Trying to connect on ${nconf.get('MAINDB_DIALECT')}:/${nconf.get(
      'MAINDB_HOST'
    )}:${nconf.get('MAINDB_PORT')}...`
  )
);
database
  .authenticate()
  .then(() => {
    if (nconf.get('NODE_ENV') != 'test') {
      console.log(chalk.green('First database connection was successful!'));
    }
    exports.mainDbConnected = true;
    connectionWasTryed = true;
  })
  .catch(err => {
    // first time
    connectionWasTryed = true;
    if (nconf.get('NODE_ENV') != 'test') {
      console.error(
        chalk.red(`
      Database error: ${err}
      ******************************************************************
      * Error connecting to Database Server on the initial connection. *
      * Verify if the server is runing and restart the application!    *
      * After the first connection, other attempts will recconect      *
      * automatically while the application is runing.                 *
      ******************************************************************`)
      );
      exports.mainDbConnected = false;
      process.exit(1);
    }
  });

exports.mainDb = database;

/**
 * @returns {Promise}
 */
exports.checkIsConnected = async resolve => {
  do {
    if (!connectionWasTryed) {
      await new Promise(resolve => setTimeout(resolve, 500));
      continue;
    } else {
      if (resolve) {
        resolve(exports.mainDbConnected);
      } else {
        return exports.mainDbConnected;
      }
    }
  } while (true);
};
