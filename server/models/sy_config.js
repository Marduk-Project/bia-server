const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');
const common = require('../../common/models/sy_config');

// model
const modelName = 'sy_config';
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
    code: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 60],
          msg: 'Nome deve ter de 1 a 60 caracteres.',
        },
      },
    },
    name: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 90],
          msg: 'Nome deve ter de 1 a 90 caracteres.',
        },
      },
    },
    valueString1: {
      type: Sequelize.STRING,
    },
    valueString2: {
      type: Sequelize.STRING,
    },
    valueString3: {
      type: Sequelize.STRING,
    },
    valueText1: {
      type: Sequelize.STRING,
    },
    valueText2: {
      type: Sequelize.STRING,
    },
    valueText3: {
      type: Sequelize.STRING,
    },
    valueInt1: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    valueInt2: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    valueInt3: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    valueDouble1: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    valueDouble2: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    valueDouble3: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    valueBoolean1: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    valueBoolean2: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    valueBoolean3: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    valueDate1: {
      type: Sequelize.DATE,
    },
    valueDate2: {
      type: Sequelize.DATE,
    },
    valueDate3: {
      type: Sequelize.DATE,
    },
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
);

// relations

// scopes
const scopes = {
  def: {
    include: ['id', 'code', 'name'],
  },
  admin: {
    maps: {},
  },
};

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
};

exports.common = common;
