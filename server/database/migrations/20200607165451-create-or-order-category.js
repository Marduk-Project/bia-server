'use strict';

const tableName = 'or_order_category';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        tableName,
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          name: {
            type: Sequelize.STRING(90),
            allowNull: false,
          },
          code: {
            type: Sequelize.STRING(60),
          },
          description: {
            type: Sequelize.TEXT('medium'),
          },
        },
        {
          transaction: transaction,
        }
      );
      // indexes
      // await queryInterface.addIndex(tableName, ['name'], {
      //  name: `${tableName}_name_idx`,
      //  transaction: transaction,
      // });
      // constraints
      // await queryInterface.addConstraint(tableName, ['email'], {
      //  type: 'unique',
      //  name: `${tableName}_email_ct`,
      //  transaction: transaction,
      // });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable(tableName, {
        transaction: transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
