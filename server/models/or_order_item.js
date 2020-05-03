const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

const {
  model: GL_ProductModel,
  jsonSerializer: gl_productJsonSerializer,
} = require('./gl_product');
const {
  model: GL_UnitModel,
  jsonSerializer: gl_unitJsonSerializer,
} = require('./gl_unit');
const {
  model: OrderModel,
  jsonSerializer: orderJsonSerializer,
} = require('./or_order');

// model
const modelName = 'or_order_item';
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
    quantity: {
      type: Sequelize.DECIMAL(16, 3),
      validate: {
        notEmpty: true,
      },
    },
    notes: {
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
GL_ProductModel.hasMany(MyModel, {
  foreignKey: 'glProductId',
  as: 'orOrderItems',
});
MyModel.belongsTo(GL_ProductModel, {
  foreignKey: 'glProductId',
  as: 'glProduct',
});
GL_UnitModel.hasMany(MyModel, {
  foreignKey: 'glUnitId',
  as: 'orOrderItems',
});
MyModel.belongsTo(GL_UnitModel, {
  foreignKey: 'glUnitId',
  as: 'glUnit',
});
OrderModel.hasMany(MyModel, {
  foreignKey: 'orderId',
  as: 'items',
});
MyModel.belongsTo(OrderModel, {
  foreignKey: 'orderId',
  as: 'order',
});

// scopes
const scopes = {
  def: {
    include: ['id'],
  },
  admin: {
    glProduct: async (value, scopeName) =>
      await gl_productJsonSerializer(value, scopeName),
    glUnit: async (value, scopeName) =>
      await gl_unitJsonSerializer(value, scopeName),
    order: async (value, scopeName) =>
      await orderJsonSerializer(value, scopeName),
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
