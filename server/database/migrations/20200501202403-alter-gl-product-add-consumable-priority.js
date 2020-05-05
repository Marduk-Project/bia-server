'use strict';

const tableName = 'gl_product';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // alters
      await queryInterface.addColumn(tableName, 'priority', Sequelize.INTEGER, {
        after: 'unityId',
        defaultValue: 0,
      });
      await queryInterface.addColumn(
        tableName,
        'consumable',
        Sequelize.BOOLEAN,
        {
          after: 'priority',
          defaultValue: false,
        }
      );
      await queryInterface.changeColumn(tableName, 'name', {
        type: Sequelize.STRING(150),
      });
    } catch (err) {
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      // alters
      await queryInterface.removeColumn(tableName, 'priority');
      await queryInterface.removeColumn(tableName, 'consumable');
      await queryInterface.changeColumn(tableName, 'name', {
        type: Sequelize.STRING(60),
      });
    } catch (err) {
      throw err;
    }
  },
};
