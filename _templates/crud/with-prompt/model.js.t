---
to: server/models/<%= name %>.js
---
const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName) { -%>
const { model: <%= field.modelCamelName %>, jsonSerializer: <%= field.camelNameNoId %>JsonSerializer } = require('./<%= field.modelName %>');
<% } -%>
<% }); -%>

// model
const modelName = '<%= name %>';
class MyModel extends BaseModel { }

MyModel.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
<% if (crud_timestamps) { -%>
  createdAt: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
<% } -%>
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (!field.modelName) { -%>
  <%= field.name %>: {
<% if (field.type == 'string') { -%>
    type: Sequelize.STRING,
<% if (field.required) { -%>
    validate: {
      notEmpty: true,
      len: {
        args: [1, 60],
        msg: 'Nome deve ter de 1 a 60 caracteres.',
      }
    },
<% } -%>
<% } -%>
<% if (field.type == 'int') { -%>
    type: Sequelize.INTEGER,
<% if (field.required) { -%>
    validate: {
      notEmpty: true,
    },
<% } -%>
<% } -%>
<% if (field.type == 'double') { -%>
    type: Sequelize.DOUBLE,
<% if (field.required) { -%>
    validate: {
      notEmpty: true,
    },
<% } -%>
<% } -%>
<% if (field.type == 'boolean') { -%>
    type: Sequelize.BOOLEAN,
    defaultValue: false,
<% } -%>
<% if (field.type == 'datetime') { -%>
    type: Sequelize.DATE,
<% if (field.required) { -%>
    validate: {
      notEmpty: true,
    },
<% } -%>
<% } -%>
  },
<% } -%>
<% }); -%>
}, {
  // options
  sequelize: mainDb,
  modelName: modelName,
  tableName: modelName,
});


// relations
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName) { -%>
<%= field.modelCamelName %>.hasMany(MyModel, {
  foreignKey: '<%= field.name %>',
  as: '????????', // TODO put correct name
});
MyModel.belongsTo(<%= field.modelCamelName %>, {
  foreignKey: '<%= field.name %>',
  as: '????????', // TODO put correct name
});
<% } -%>
<% }); -%>


// scopes
const scopes = {
  def: {
    include: ['id', 'name'], // TODO scopes
  },
  admin: {
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName) { -%>
    <%= field.camelNameNoId %>: async (value, scopeName) => await <%= field.camelNameNoId %>JsonSerializer(value, scopeName),
<% } -%>
<% }); -%>
  }
}


exports.model = MyModel;
exports.modelName = modelName;
exports.jsonSerializer = async (value, scopeName) => {
  if (!scopeName) {
    scopeName = 'def';
  }
  if (!scopes[scopeName]) {
    scopeName = 'def';
  }
  return await jsonSerializer(value, scopes[scopeName], scopeName);
}
