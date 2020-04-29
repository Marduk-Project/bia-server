const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nconf = require('nconf')
const { mainDb } = require('../database/main_connection')
const { BaseModel } = require('./base_model')
const { Sequelize, DataTypes } = require('sequelize')

const { model: UserModel } = require('./gl_user')

// model
const modelName = 'gl_user_recover'
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
    token: {
      type: Sequelize.STRING,
    },
    expiresWhen: {
      type: Sequelize.DATE,
    },
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
)

UserModel.hasMany(MyModel, {
  foreignKey: 'userId',
  as: 'recovers',
})
MyModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
})

exports.model = MyModel
exports.modelName = modelName

// TODO task para deletar as vencidas
