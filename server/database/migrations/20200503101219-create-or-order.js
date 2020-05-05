'use strict';

const tableName = 'or_order';

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
          type: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          glUserId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'gl_user',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          glPersonOriginId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'gl_person',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          glPersonContactOriginId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'gl_person_contact',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          glPersonDestinationId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'gl_person',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          glPersonContactDestinationId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'gl_person_contact',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          notes: {
            type: Sequelize.TEXT('medium'),
          },
          internalNotes: {
            type: Sequelize.TEXT('medium'),
          },
          needsReview: {
            type: Sequelize.BOOLEAN,
          },
          status: {
            type: Sequelize.INTEGER,
          },
          expiresIn: {
            type: Sequelize.DATE,
          },
        },
        {
          transaction: transaction,
        }
      );
      // indexes
      await queryInterface.addIndex(tableName, ['needsReview'], {
        name: `${tableName}_needsReview_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['createdAt', 'status'], {
        name: `${tableName}_createdAt_status_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['createdAt', 'type'], {
        name: `${tableName}_createdAt_type_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['expiresIn'], {
        name: `${tableName}_expiresIn_idx`,
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
