'use strict';

const {
  importToDatabase,
} = require('../../../source-data/products/import-to-database');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await importToDatabase();
    } catch (err) {
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    // none
  },
};
