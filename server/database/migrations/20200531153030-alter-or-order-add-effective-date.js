'use strict';

const tableName = 'or_order';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // alters
      await queryInterface.addColumn(
        tableName,
        'effectiveDate',
        Sequelize.DATEONLY,
        {
          after: 'expiresIn',
        }
      );
      // indexes
      await queryInterface.addIndex(tableName, ['effectiveDate', 'type'], {
        name: `${tableName}_effectiveDate_type_idx`,
        transaction: transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // indexes
      await queryInterface.removeIndex(
        tableName,
        `${tableName}_effectiveDate_type_idx`
      );
      // alters
      await queryInterface.removeColumn(tableName, 'effectiveDate');
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
