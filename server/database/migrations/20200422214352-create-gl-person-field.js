'use strict'

const tableName = 'gl_person_field'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
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
          fieldId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'gl_field',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          fieldItemId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'gl_field_item',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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
          valueString: {
            type: Sequelize.STRING(60),
          },
          valueInt: {
            type: Sequelize.INTEGER,
          },
          valueDouble: {
            type: Sequelize.DOUBLE,
          },
          valueBoolean: {
            type: Sequelize.BOOLEAN,
          },
          valueSearch: {
            type: Sequelize.STRING(60),
          },
        },
        {
          transaction: transaction,
        }
      )
      // indexes
      await queryInterface.addIndex(tableName, ['personId', 'fieldId'], {
        name: `${tableName}_personId_fieldId_idx`,
        transaction: transaction,
      })
      await queryInterface.addIndex(tableName, ['fieldItemId'], {
        name: `${tableName}_fieldItemId_idx`,
        transaction: transaction,
      })
      await queryInterface.addIndex(tableName, ['fieldId'], {
        name: `${tableName}_fieldId_idx`,
        transaction: transaction,
      })
      await queryInterface.addIndex(tableName, ['personId', 'valueString'], {
        name: `${tableName}_personId_valueString_idx`,
        transaction: transaction,
      })
      await queryInterface.addIndex(tableName, ['valueSearch'], {
        name: `${tableName}_valueSearch_idx`,
        transaction: transaction,
      })
      // constraints
      // await queryInterface.addConstraint(tableName, ['email'], {
      //  type: 'unique',
      //  name: `${tableName}_email_ct`,
      //  transaction: transaction,
      // });
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable(tableName, {
        transaction: transaction,
      })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
