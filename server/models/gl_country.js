const nconf = require('nconf')
const { Sequelize, DataTypes } = require('sequelize')

const { mainDb } = require('../database/main_connection')
const { BaseModel, jsonSerializer } = require('./base_model')

// model
const modelName = 'gl_country'
class MyModel extends BaseModel {
  static async findByCode(code) {
    return await this.findOne({
      where: {
        code: code,
      },
    })
  }
}

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
      validate: {
        notEmpty: false,
        len: {
          args: [1, 60],
          msg: 'Nome deve ter de 1 a 60 caracteres.',
        },
      },
    },
    code: {
      type: Sequelize.STRING,
    },
    priority: {
      type: Sequelize.INTEGER,
    },
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
)

const scopes = {
  def: {
    include: ['id', 'name', 'code'],
  },
  admin: {}, // all
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
