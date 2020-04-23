---
to: server/database/migrations/<%= nowPreffix %>-create-<%= name %>.js
---
'use strict';

const tableName = '<%= name %>';

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
<% if (crud_timestamps) { -%>
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
<% } -%>
<% crud_fieldObjects.forEach(function(field) { -%>
        <%= field.name %>: {
<% if (field.type == 'string') { -%>
          type: Sequelize.STRING(60),
<% if (field.required) { -%>
          allowNull: false,
<% } -%>
<% } -%>
<% if (field.type == 'int') { -%>
          type: Sequelize.INTEGER,
<% if (field.required) { -%>
          allowNull: false,
<% } -%>
<% if (field.modelName) { -%>
          references: {
            model: '<%= field.modelName %>',
            key: 'id',
          },
          onUpdate: 'CASCADE', // TODO implement
          onDelete: 'RESTRICT', // TODO implement
<% } -%>
<% } -%>
<% if (field.type == 'double') { -%>
          type: Sequelize.DOUBLE,
<% if (field.required) { -%>
          allowNull: false,
<% } -%>
<% } -%>
<% if (field.type == 'boolean') { -%>
          type: Sequelize.BOOLEAN,
<% if (field.required) { -%>
          allowNull: false,
<% } -%>
<% } -%>
<% if (field.type == 'datetime') { -%>
          type: Sequelize.DATE,
<% if (field.required) { -%>
          allowNull: false,
<% } -%>
<% } -%>
        },
<% }); -%>
      },
        {
          transaction: transaction
        }
      );
      // indexes
      // await queryInterface.addIndex(tableName, ['name'], {
      //  name: `${tableName}_name_idx`,
      //  transaction: transaction,
      // });
      // constraints
      // await queryInterface.addConstraint(tableName, ['email'], {
      //  type: 'unique',
      //  name: `${tableName}_email_ct`,
      //  transaction: transaction,
      // });
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
