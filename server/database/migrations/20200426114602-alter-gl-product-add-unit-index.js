'use strict'

const tableName = 'gl_product'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      // alter
      await queryInterface.renameColumn(tableName, 'unityId', 'unitId')
      // indexes
      await queryInterface.addIndex(tableName, ['unitId'], {
        name: `${tableName}_unitId_idx`,
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
      // alter
      await queryInterface.renameColumn(tableName, 'unitId', 'unityId')
      // indexes
      await queryInterface.removeIndex(tableName, `${tableName}_unitId_idx`)
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
