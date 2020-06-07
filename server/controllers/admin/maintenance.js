const fs = require('fs');
const chalk = require('chalk');
const { body, query, param } = require('express-validator/check');
const { QueryTypes } = require('sequelize');

const { nconf, filepath } = require('../../../config.js');
const {
  ApiError,
  validationEndFunction,
} = require('../../middlewares/error-mid');
const uploadMid = require('../../middlewares/upload-mid');
const { mainDb } = require('../../database/main_connection');

/**
 * Get config data
 */
exports.getConfig = (req, res, next) => {
  throw new ApiError('Função temporariamente inativa.');
  // let config = fs.readFileSync(filepath, { encoding: 'utf-8' });
  // res.sendJsonOK({
  //   file_content: config ? config : '{ "erro": true }',
  // });
};

/**
 * Config update
 */
exports.postConfig = (req, res, next) => {
  throw new ApiError('Função temporariamente inativa.');
  /*
  try {
    const config = JSON.parse(req.body.file_content);
    fs.writeFile(filepath, req.body.file_content, (err) => {
      if (err) {
        next(err);
      } else {
        res.sendJsonOK();
      }
    });
  } catch (err) {
    throw new Error('Formato do arquivo inválido ou erro ao salvar dados.');
  }
  */
};

/**
 * Import data from IBGE
 */
exports.postIbgeImport = async (req, res, next) => {
  try {
    const {
      importToDatabase,
    } = require('../../../source-data/ibge/import-to-database');
    // start async
    importToDatabase(true).catch(err => {
      console.log(chalk.red('Error importing data...', err));
    });
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};

/**
 * Import data city REGIONS
 */
exports.postCityRegionImport = async (req, res, next) => {
  try {
    const {
      importToDatabase,
    } = require('../../../source-data/cityregion/import-to-database');
    // start async
    importToDatabase(true).catch(err => {
      console.log(chalk.red('Error importing data...', err));
    });
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};

exports.postProductImport = async (req, res, next) => {
  try {
    const {
      importToDatabase,
    } = require('../../../source-data/products/import-to-database');
    // start async
    importToDatabase(true).catch(err => {
      console.log(chalk.red('Error importing data...', err));
    });
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};

exports.postFileJsonImportValidate = [
  uploadMid.uploadJsonMid.single('file'),
  uploadMid.uploadFileCheckRequiredMid,
  uploadMid.uploadUtilsMid,
  validationEndFunction,
];

exports.postImportOrderConsolidated = async (req, res, next) => {
  try {
    const {
      importToDatabase,
    } = require('../../../source-data/consolidated/import-to-database');
    const jsonFile = JSON.parse(
      fs.readFileSync(req.file.path).toString('utf8')
    );
    await importToDatabase(true, jsonFile, true);
    res.sendJsonOK();
  } catch (err) {
    next(err);
  } finally {
    await req.uploadsRemove();
  }
};

exports.postPersonImport = async (req, res, next) => {
  try {
    const {
      importToDatabase,
    } = require('../../../source-data/persons/import-to-database');
    const jsonFile = JSON.parse(
      fs.readFileSync(req.file.path).toString('utf8')
    );
    await importToDatabase(true, jsonFile, true);
    res.sendJsonOK();
  } catch (err) {
    next(err);
  } finally {
    await req.uploadsRemove();
  }
};

exports.postOrderRequestImport = async (req, res, next) => {
  try {
    const {
      importToDatabase,
    } = require('../../../source-data/order_request/import-to-database');
    const jsonFile = JSON.parse(
      fs.readFileSync(req.file.path).toString('utf8')
    );
    await importToDatabase(true, jsonFile, true);
    res.sendJsonOK();
  } catch (err) {
    next(err);
  } finally {
    await req.uploadsRemove();
  }
};

exports.postOrderSupplyImport = async (req, res, next) => {
  try {
    const {
      importToDatabase,
    } = require('../../../source-data/order_supply/import-to-database');
    const jsonFile = JSON.parse(
      fs.readFileSync(req.file.path).toString('utf8')
    );
    await importToDatabase(true, jsonFile, true);
    res.sendJsonOK();
  } catch (err) {
    next(err);
  } finally {
    await req.uploadsRemove();
  }
};

exports.postRunSqlValidate = [
  body('sqlCommand').isString().not().isEmpty(),
  validationEndFunction,
];

exports.postRunSql = async (req, res, next) => {
  try {
    const [results, metadata] = await mainDb.query(req.body.sqlCommand);
    res.sendJsonOK({
      results,
    });
  } catch (err) {
    next(err);
  }
};
