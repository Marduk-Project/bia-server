'use strict';

const tableName = 'sy_config';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // create
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
          code: {
            type: Sequelize.STRING(60),
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING(90),
          },

          // double
          valueDouble1: {
            type: Sequelize.DOUBLE,
            defaultValue: 0,
          },
          valueDouble2: {
            type: Sequelize.DOUBLE,
            defaultValue: 0,
          },
          valueDouble3: {
            type: Sequelize.DOUBLE,
            defaultValue: 0,
          },

          // ints
          valueInt1: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          valueInt2: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          valueInt3: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },

          // bools
          valueBoolean1: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          valueBoolean2: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          valueBoolean3: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },

          // strings
          valueString1: {
            type: Sequelize.STRING(500),
          },
          valueString2: {
            type: Sequelize.STRING(500),
          },
          valueString3: {
            type: Sequelize.STRING(500),
          },

          // texts
          valueText1: {
            type: Sequelize.TEXT('medium'),
          },
          valueText2: {
            type: Sequelize.TEXT('medium'),
          },
          valueText3: {
            type: Sequelize.TEXT('medium'),
          },

          // dates
          valueDate1: {
            type: Sequelize.DATE,
          },
          valueDate2: {
            type: Sequelize.DATE,
          },
          valueDate3: {
            type: Sequelize.DATE,
          },
        },
        {
          uniqueKeys: {
            code: {
              customIndex: true,
              fields: ['code'],
            },
          },
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
