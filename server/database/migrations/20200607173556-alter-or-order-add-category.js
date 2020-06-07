'use strict';

const tableName = 'or_order';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // alters
      await queryInterface.addColumn(
        tableName,
        'orderCategoryId',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'or_order_category',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        {
          after: 'effectiveDate',
        }
      );
    } catch (err) {
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      // alters
      await queryInterface.removeConstraint(
        tableName,
        `or_order_orderCategoryId_foreign_idx`
      );
      await queryInterface.removeColumn(tableName, 'orderCategoryId');
    } catch (err) {
      throw err;
    }
  },
};
