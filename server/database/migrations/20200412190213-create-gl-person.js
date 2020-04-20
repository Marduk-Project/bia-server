'use strict';

const tableName = 'gl_person';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(tableName, {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        legalType: Sequelize.INTEGER,
        legalIdentifierType: Sequelize.STRING(60),
        legalIdentifierCode: Sequelize.STRING(60),
        name: {
          type: Sequelize.STRING(90),
          allowNull: false,
        },
        shortname: Sequelize.STRING(90),
        phone: Sequelize.STRING(60),
        cellphone: Sequelize.STRING(60),
        email: Sequelize.STRING(60),
        address: Sequelize.STRING(90),
        addressZipcode: Sequelize.STRING(60),
        addressNumber: Sequelize.STRING(60),
        addressExtra: Sequelize.STRING(60),
        addressNeighborhood: Sequelize.STRING(60),
        cityId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'gl_city',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        birthdate: Sequelize.DATE,
        trusted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        latitude: {
          type: Sequelize.DECIMAL(10, 7),
          defaultValue: 0,
        },
        longitude: {
          type: Sequelize.DECIMAL(10, 7),
          defaultValue: 0,
        },
        obs: Sequelize.TEXT('medium'),
      }, {
        transaction: transaction
      });
      // indexes
      await queryInterface.addIndex(tableName, ['name'], {
        name: `${tableName}_name_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['shortname'], {
        name: `${tableName}_shortname_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['legalIdentifierCode'], {
        name: `${tableName}_legalIdentifierCode_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['latitude', 'longitude'], {
        name: `${tableName}_latlng_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['longitude', 'latitude'], {
        name: `${tableName}_lnglat_idx`,
        transaction: transaction,
      });
      await queryInterface.addIndex(tableName, ['cityId', 'addressNeighborhood', 'name'], {
        name: `${tableName}_cityId_neighbor_idx`,
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
  }
};
