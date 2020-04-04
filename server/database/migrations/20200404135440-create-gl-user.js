'use strict';

const { Sequelize } = require('sequelize');

const tableName = 'gl_user';

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
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        nickname: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        level: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 10, // account
        },
        login_tryCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        login_tryWait: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
        {
          transaction: transaction
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
  }
};