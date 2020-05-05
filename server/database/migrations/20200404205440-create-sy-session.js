'use strict';

const tableName = 'sy_session';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        tableName,
        {
          sid: {
            type: Sequelize.STRING(90),
            primaryKey: true,
          },
          userId: Sequelize.STRING(90),
          expires: Sequelize.DATE,
          data: Sequelize.STRING(50000),
          createdAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        {
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
