"use strict";

const tableName = "gl_city_state_region";

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
          cityId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "gl_city",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          type: {
            type: Sequelize.STRING(60),
            allowNull: false,
          },
          stateRegionId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "gl_state_region",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
        },
        {
          transaction: transaction,
        }
      );
      // indexes
      await queryInterface.addIndex(tableName, ["cityId", "type"], {
        name: `${tableName}_cityId_type_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ["stateRegionId", "type"], {
        name: `${tableName}_stateRegionId_type_idx`,
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
