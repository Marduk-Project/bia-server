const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

const {
  model: GL_UserModel,
  jsonSerializer: gl_userJsonSerializer,
} = require('./gl_user');
const {
  model: OR_OrderModel,
  jsonSerializer: or_orderJsonSerializer,
  statusToString,
  typeToString,
} = require('./or_order');

// model
const modelName = 'or_order_history';
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
    oldStatus: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    oldType: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    changes: {
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
GL_UserModel.hasMany(MyModel, {
  foreignKey: 'glUserId',
  as: 'glUser',
});
MyModel.belongsTo(GL_UserModel, {
  foreignKey: 'glUserId',
  as: 'glUser',
});
OR_OrderModel.hasMany(MyModel, {
  foreignKey: 'orderId',
  as: 'histories',
});
MyModel.belongsTo(OR_OrderModel, {
  foreignKey: 'orderId',
  as: 'order',
});

// scopes
const scopes = {
  def: {
    include: ['id'],
  },
  admin: {
    glUuser: async (value, scopeName) =>
      await gl_userJsonSerializer(value, scopeName),
    order: async (value, scopeName) =>
      await or_orderJsonSerializer(value, scopeName),
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
