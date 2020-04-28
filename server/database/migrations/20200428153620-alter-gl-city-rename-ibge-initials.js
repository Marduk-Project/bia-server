"use strict";

const tableName = "gl_city";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // alters
      await queryInterface.renameColumn(tableName, "ibgeCode", "code");
      await queryInterface.addColumn(
        tableName,
        "initials",
        Sequelize.STRING(60),
        {
          after: "code",
          allowNull: true,
        }
      );
      // indexes
      await queryInterface.removeIndex(
        tableName,
        `${tableName}_ibgeCode_priority_idx`
      );
      await queryInterface.addIndex(tableName, ["code", "priority"], {
        name: `${tableName}_code_priority_idx`,
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
      // alters
      await queryInterface.renameColumn(tableName, "code", "ibgeCode");
      await queryInterface.removeColumn(tableName, "initials");
      // indexes
      await queryInterface.removeIndex(
        tableName,
        `${tableName}_code_priority_idx`
      );
      await queryInterface.addIndex(tableName, ["ibgeCode", "priority"], {
        name: `${tableName}_ibgeCode_priority_idx`,
        transaction: transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
