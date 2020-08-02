'use strict';

const tableName = 'or_order_consolidated';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // === constraints
      // glProductId
      let fkNameOld = `${tableName}_ibfk_1`;
      let fkNameNew = `${tableName}_glProductId_foreign_idx`;
      await queryInterface.removeConstraint(tableName, fkNameOld);
      await queryInterface.addConstraint(tableName, {
        fields: ['glProductId'],
        type: 'foreign key',
        name: fkNameNew,
        references: {
          table: 'gl_product',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // glUnitId
      fkNameOld = `${tableName}_ibfk_2`;
      fkNameNew = `${tableName}_glUnitId_foreign_idx`;
      await queryInterface.removeConstraint(tableName, fkNameOld);
      await queryInterface.addConstraint(tableName, {
        fields: ['glUnitId'],
        type: 'foreign key',
        name: fkNameNew,
        references: {
          table: 'gl_unit',
          field: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      // glPersonDestinationId
      fkNameOld = `${tableName}_ibfk_3`;
      fkNameNew = `${tableName}_glPersonDestinationId_foreign_idx`;
      await queryInterface.removeConstraint(tableName, fkNameOld);
      await queryInterface.addConstraint(tableName, {
        fields: ['glPersonDestinationId'],
        type: 'foreign key',
        name: fkNameNew,
        references: {
          table: 'gl_person',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    } catch (err) {
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      // === constraints
      // glProductId
      let fkNameOld = `${tableName}_glProductId_foreign_idx`;
      let fkNameNew = `${tableName}_ibfk_1`;
      await queryInterface.removeConstraint(tableName, fkNameOld);
      await queryInterface.addConstraint(tableName, {
        fields: ['glProductId'],
        type: 'foreign key',
        name: fkNameNew,
        references: {
          table: 'gl_product',
          field: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      // glUnitId
      fkNameOld = `${tableName}_glUnitId_foreign_idx`;
      fkNameNew = `${tableName}_ibfk_2`;
      await queryInterface.removeConstraint(tableName, fkNameOld);
      await queryInterface.addConstraint(tableName, {
        fields: ['glUnitId'],
        type: 'foreign key',
        name: fkNameNew,
        references: {
          table: 'gl_unit',
          field: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      // glPersonDestinationId
      fkNameOld = `${tableName}_glPersonDestinationId_foreign_idx`;
      fkNameNew = `${tableName}_ibfk_3`;
      await queryInterface.removeConstraint(tableName, fkNameOld);
      await queryInterface.addConstraint(tableName, {
        fields: ['glPersonDestinationId'],
        type: 'foreign key',
        name: fkNameNew,
        references: {
          table: 'gl_person',
          field: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    } catch (err) {
      throw err;
    }
  },
};
