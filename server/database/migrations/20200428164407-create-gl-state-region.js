'use strict';

const tableName = 'gl_state_region';

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
          code: {
            type: Sequelize.STRING(60),
          },
          type: {
            type: Sequelize.STRING(60),
            allowNull: false,
          },
          stateId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'gl_state',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        },
        {
          transaction: transaction,
        }
      );
      // indexes
      await queryInterface.addIndex(tableName, ['name', 'type'], {
        name: `${tableName}_name_type_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['type', 'name'], {
        name: `${tableName}_type_name_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['code', 'type'], {
        name: `${tableName}_code_type_idx`,
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
