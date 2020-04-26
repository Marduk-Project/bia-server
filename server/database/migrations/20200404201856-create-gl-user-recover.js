"use strict";

const tableName = "gl_user_recover";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
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
        token: {
          type: Sequelize.STRING,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "gl_user",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        expiresWhen: {
          type: Sequelize.DATE,
        },
      });
      // indexes
      await queryInterface.addIndex(tableName, ["expiresWhen"], {
        name: `${tableName}_expiresWhen_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ["userId"], {
        name: `${tableName}_userId_idx`,
        transaction: transaction,
      });
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
