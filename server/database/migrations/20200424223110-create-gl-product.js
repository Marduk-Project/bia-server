'use strict';

const tableName = 'gl_product';

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
          description: {
            type: Sequelize.TEXT('medium'),
          },
          eanCode: {
            type: Sequelize.STRING(60),
          },
          healthCode: {
            type: Sequelize.STRING(60),
          },
          requestFormActive: {
            type: Sequelize.BOOLEAN,
          },
          unitId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'gl_unit',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
        },
        {
          transaction: transaction,
        }
      );
      // indexes
      await queryInterface.addIndex(tableName, ['name'], {
        name: `${tableName}_name_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['eanCode'], {
        name: `${tableName}_eanCode_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['healthCode'], {
        name: `${tableName}_healthCode_idx`,
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
