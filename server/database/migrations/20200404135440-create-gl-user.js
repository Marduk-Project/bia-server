'use strict';

const tableName = 'gl_user';

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
          },
          nickname: {
            type: Sequelize.STRING(60),
          },
          email: {
            type: Sequelize.STRING(80),
            allowNull: false,
          },
          password: {
            type: Sequelize.STRING(60),
          },
          blocked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          level: {
            type: Sequelize.INTEGER,
            defaultValue: 10, // account
          },
          loginTryCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          loginTryWait: {
            type: Sequelize.DATE,
          },
        },
        {
          transaction: transaction,
        }
      );
      // indexes
      await queryInterface.addIndex(tableName, ['email'], {
        name: `${tableName}_email_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['name'], {
        name: `${tableName}_name_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['nickname'], {
        name: `${tableName}_nickname_idx`,
        transaction: transaction,
      });
      // constraints
      await queryInterface.addConstraint(tableName, ['email'], {
        type: 'unique',
        name: `${tableName}_email_ct`,
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
