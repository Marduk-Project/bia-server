const nconf = require('nconf')
const { Sequelize, DataTypes } = require('sequelize')

const { mainDb } = require('../database/main_connection')
const { BaseModel, jsonSerializer } = require('./base_model')

const {
  model: FieldModel,
  jsonSerializer: fieldJsonSerializer,
} = require('./gl_field')

// model
const modelName = 'gl_field_item'
class MyModel extends BaseModel {}

MyModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    name: {
      type: Sequelize.STRING,
    },
    order: {
      type: Sequelize.INTEGER,
    },
    valueString: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 60],
          msg: 'Nome deve ter de 1 a 60 caracteres.',
        },
      },
    },
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
)

// relations
FieldModel.hasMany(MyModel, {
  foreignKey: 'fieldId',
  as: 'items',
})
MyModel.belongsTo(FieldModel, {
  foreignKey: 'fieldId',
  as: 'field',
})

// scopes
const scopes = {
  def: {
    include: ['id', 'fieldId', 'field', 'name', 'code', 'order', 'valueString'],
  },
  admin: {
    field: async (value, scopeName) =>
      await fieldJsonSerializer(value, scopeName),
  },
}

exports.model = MyModel
exports.modelName = modelName
exports.jsonSerializer = async (value, scopeName) => {
  if (!scopeName) {
    scopeName = 'def'
  }
  if (!scopes[scopeName]) {
    scopeName = 'def'
  }
  return await jsonSerializer(value, scopes[scopeName], scopeName)
}
