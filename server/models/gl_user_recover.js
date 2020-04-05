const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nconf = require('nconf');
const { mainDb } = require('../database/main_connection');
const { BaseModel } = require('./base_model');
const { Sequelize, DataTypes, Model } = require('sequelize');

// model
const modelName = 'gl_user_recover';
class UserRecover extends BaseModel { }

UserRecover.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
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
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'gl_user',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  expiresWhen: {
    type: Sequelize.DATE,
  },
}, {
  // options
  sequelize: mainDb,
  modelName: modelName,
  tableName: modelName,
});

exports.model = UserRecover;
exports.modelName = modelName;

// TODO task para deletar as vencidas