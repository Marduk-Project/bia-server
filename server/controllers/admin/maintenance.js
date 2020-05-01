const fs = require("fs");
const chalk = require("chalk");
const { nconf, filepath } = require("../../../config.js");
const { ApiError } = require("../../middlewares/error-mid");

/**
 * Get config data
 */
exports.getConfig = (req, res, next) => {
  throw new ApiError("Função temporariamente inativa.");
  // let config = fs.readFileSync(filepath, { encoding: 'utf-8' });
  // res.sendJsonOK({
  //   file_content: config ? config : '{ "erro": true }',
  // });
};

/**
 * Config update
 */
exports.postConfig = (req, res, next) => {
  throw new ApiError("Função temporariamente inativa.");
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
    } = require("../../../source-data/ibge/import-to-database");
    // start async
    importToDatabase(true).catch((err) => {
      console.log(chalk.red("Error importing data...", err));
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
    } = require("../../../source-data/cityregion/import-to-database");
    // start async
    importToDatabase(true).catch((err) => {
      console.log(chalk.red("Error importing data...", err));
    });
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};
