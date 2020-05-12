'use strict';

const tableName = 'gl_person_contact';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // alters
      await queryInterface.addColumn(
        tableName,
        'extensionNumber',
        Sequelize.STRING(60),
        {
          after: 'canEditOrder',
          transaction: transaction,
        }
      );
      await queryInterface.addColumn(
        tableName,
        'positionHeld',
        Sequelize.STRING(60),
        {
          after: 'extensionNumber',
          transaction: transaction,
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // alters
      await queryInterface.removeColumn(tableName, 'extensionNumber', {
        transaction: transaction,
      });
      await queryInterface.removeColumn(tableName, 'positionHeld', {
        transaction: transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
