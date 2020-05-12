'use strict';

const tableName = 'gl_person';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // alters
      await queryInterface.addColumn(
        tableName,
        'priority',
        {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        {
          after: 'obs',
          transaction: transaction,
        }
      );
      await queryInterface.addColumn(
        tableName,
        'personParentId',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: tableName,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        {
          after: 'priority',
          transaction: transaction,
        }
      );
      await queryInterface.addColumn(
        tableName,
        'personTypeId',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'gl_person_type',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        {
          after: 'personParentId',
          transaction: transaction,
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      // alters
      await queryInterface.removeColumn(tableName, 'priority');
      await queryInterface.removeConstraint(
        tableName,
        `gl_person_personTypeId_foreign_idx`
      );
      await queryInterface.removeConstraint(
        tableName,
        `gl_person_personParentId_foreign_idx`
      );
      await queryInterface.removeColumn(tableName, 'personParentId');
      await queryInterface.removeColumn(tableName, 'personTypeId');
    } catch (err) {
      throw err;
    }
  },
};
