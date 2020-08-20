'use strict';

const tableName = 'gl_form_contact';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable(tableName, {
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
        type: {
          type: Sequelize.STRING(90),
          allowNull: false,
        },
        personName: {
          type: Sequelize.STRING(90),
          allowNull: false,
        },
        personEmail: {
          type: Sequelize.STRING(60),
        },
        personPhone: {
          type: Sequelize.STRING(60),
        },
        subject: {
          type: Sequelize.STRING(90),
          allowNull: false,
        },
        message: {
          type: Sequelize.TEXT('medium'),
          allowNull: false,
        },
        response: {
          type: Sequelize.TEXT('medium'),
        },
        responseDateTime: {
          type: Sequelize.DATE,
        },
        internalNotes: {
          type: Sequelize.TEXT('medium'),
        },
        userCreatedId: {
          type: Sequelize.INTEGER,
        },
        userResponseId: {
          type: Sequelize.INTEGER,
        },
        needsReview: {
          type: Sequelize.BOOLEAN,
        },
        remoteIp: {
          type: Sequelize.STRING(90),
        },
      });

      // indexes

      await queryInterface.addIndex(tableName, ['type', 'createdAt'], {
        name: `${tableName}_type_createdAt_idx`,
      });

      await queryInterface.addIndex(tableName, ['createdAt'], {
        name: `${tableName}_createdAt_idx`,
      });

      await queryInterface.addIndex(tableName, ['personEmail'], {
        name: `${tableName}_personEmail_idx`,
      });

      // == foreigns

      // userCreatedId
      await queryInterface.addConstraint(tableName, {
        fields: ['userCreatedId'],
        type: 'foreign key',
        name: `${tableName}_userCreatedId_foreign_idx`,
        references: {
          table: 'gl_user',
          field: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      // userResponseId
      await queryInterface.addConstraint(tableName, {
        fields: ['userResponseId'],
        type: 'foreign key',
        name: `${tableName}_userResponseId_foreign_idx`,
        references: {
          table: 'gl_user',
          field: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    } catch (err) {
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
