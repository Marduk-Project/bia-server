'use strict';

const {
  importToDatabase,
} = require('../../../source-data/ibge/import-to-database');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await importToDatabase(true);
    } catch (err) {
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    // none
  },
};
