'use strict'

const tableName = 'gl_state'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // alters
      await queryInterface.addColumn(
        tableName,
        'initials',
        Sequelize.STRING(60),
        {
          after: 'code',
          allowNull: true,
        }
      )
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // alters
      await queryInterface.removeColumn(tableName, 'initials')
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
