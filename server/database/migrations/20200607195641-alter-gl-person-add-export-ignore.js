'use strict';

const tableName = 'gl_person';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // alters
      await queryInterface.addColumn(
        tableName,
        'exportIgnore',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        {
          after: 'personTypeId',
        }
      );
    } catch (err) {
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      // alters
      await queryInterface.removeColumn(tableName, 'exportIgnore');
    } catch (err) {
      throw err;
    }
  },
};
