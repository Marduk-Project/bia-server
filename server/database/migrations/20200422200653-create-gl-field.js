'use strict';

const tableName = 'gl_field';

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
            type: Sequelize.STRING(60),
            allowNull: false,
          },
          destination: {
            type: Sequelize.STRING(60),
            allowNull: false,
          },
          code: {
            type: Sequelize.STRING(60),
          },
          type: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          order: {
            type: Sequelize.INTEGER,
          },
          defaultValue: {
            type: Sequelize.STRING(60),
          },
        },
        {
          transaction: transaction,
        }
      );
      // indexes
      await queryInterface.addIndex(tableName, ['destination', 'name'], {
        name: `${tableName}_destName_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['name'], {
        name: `${tableName}_name_idx`,
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
