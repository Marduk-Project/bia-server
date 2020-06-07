const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

const {
  model: OR_OrderModel,
  jsonSerializer: or_orderJsonSerializer,
} = require('./or_order');

// model
const modelName = 'or_order_category';
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
      validate: {
        notEmpty: true,
        len: {
          args: [1, 90],
          msg: 'Nome deve ter de 1 a 90 caracteres.',
        },
      },
    },
    code: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
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
MyModel.hasMany(OR_OrderModel, {
  foreignKey: 'orderCategoryId',
  as: 'orders',
});
OR_OrderModel.belongsTo(MyModel, {
  foreignKey: 'orderCategoryId',
  as: 'orderCategory',
});

// scopes
const scopes = {
  def: {
    include: ['id', 'name', 'code'],
  },
  admin: {
    include: ['id', 'createdAt', 'updatedAt', 'name', 'code'],
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
