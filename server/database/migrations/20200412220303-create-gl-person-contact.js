'use strict';

const tableName = 'gl_person_contact';

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
        phone: Sequelize.STRING(60),
        cellphone: Sequelize.STRING(60),
        email: Sequelize.STRING(60),
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'gl_user',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        personId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'gl_person',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        personReferenceId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'gl_person',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        trusted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        level: Sequelize.INTEGER,
        obs: Sequelize.TEXT('medium'),
        canRegisterPPERequest: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      }, {
        transaction: transaction
      });
      // indexes
      await queryInterface.addIndex(tableName, ['name'], {
        name: `${tableName}_name_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['userId'], {
        name: `${tableName}_userId_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['personId'], {
        name: `${tableName}_personId_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['personReferenceId'], {
        name: `${tableName}_personReferenceId_idx`,
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
