const nconf = require('nconf');
const { mainDb } = require('../database/main_connection');
const { BaseModel } = require('./base_model');
const { Sequelize, DataTypes } = require('sequelize');

const { model: CountryModel } = require('./gl_country');

// model
const modelName = 'gl_state';
class MyModel extends BaseModel { }

MyModel.init({
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
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: false,
      len: {
        args: [1, 60],
        msg: 'Nome deve ter de 1 a 60 caracteres.',
      }
    }
  },
  code: {
    type: Sequelize.STRING,
  },
  priority: {
    type: Sequelize.INTEGER,
  },
}, {
  // options
  sequelize: mainDb,
  modelName: modelName,
  tableName: modelName,
});

CountryModel.hasMany(MyModel, {
  foreignKey: 'countryId',
  as: 'states'
});
MyModel.belongsTo(CountryModel, {
  foreignKey: 'countryId',
  as: 'country',
});

exports.model = MyModel;
exports.modelName = modelName;
