'use strict'

const tableName = 'gl_unity'

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
          name: {
            type: Sequelize.STRING(60),
            allowNull: false,
          },
          nameSingular: {
            type: Sequelize.STRING(60),
          },
          namePlural: {
            type: Sequelize.STRING(60),
          },
          unity: {
            type: Sequelize.STRING(60),
          },
        },
        {
          transaction: transaction,
        }
      )
      // indexes
      // await queryInterface.addIndex(tableName, ['name'], {
      //  name: `${tableName}_name_idx`,
      //  transaction: transaction,
      // });
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
