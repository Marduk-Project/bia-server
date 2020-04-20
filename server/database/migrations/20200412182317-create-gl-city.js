'use strict';

const tableName = 'gl_city';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(tableName, {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        name: Sequelize.STRING(60),
        ibgeCode: Sequelize.STRING(60),
        priority: {
          type: Sequelize.INTEGER(1),
          defaultValue: 0,
        },
        stateId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'gl_state',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      }, {
        transaction: transaction
      });
      // indexes
      await queryInterface.addIndex(tableName, ['name', 'priority'], {
        name: `${tableName}_name_priority_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['ibgeCode', 'priority'], {
        name: `${tableName}_ibgeCode_priority_idx`,
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
  }
};
