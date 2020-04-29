'use strict'

const tableName = 'gl_unit'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // alters
      await queryInterface.renameTable('gl_unity', tableName)
      await queryInterface.renameColumn(tableName, 'unity', 'unit')
      // indexes
      await queryInterface.addIndex(tableName, ['name'], {
        name: `${tableName}_name_idx`,
        transaction: transaction,
      })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // indexes
      await queryInterface.removeIndex(tableName, `${tableName}_name_idx`)
      // alters
      await queryInterface.renameColumn(tableName, 'unit', 'unity')
      await queryInterface.renameTable(tableName, 'gl_unity')
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
