const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nconf = require('nconf');
const { mainDb } = require('../database/main_connection');
const { BaseModel } = require('./base_model');
const { Sequelize, DataTypes, Model } = require('sequelize');


const modelName = 'sy_session';
class Session extends Model { }

Session.init({
  sid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  userId: Sequelize.STRING,
  expires: Sequelize.DATE,
  data: Sequelize.STRING(50000)
}, {
  // options
  sequelize: mainDb,
  tableName: modelName,
  modelName: modelName,
  timestamps: false,
});

exports.model = Session;
exports.modelName = modelName;
