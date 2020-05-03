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
  model: GL_PersonModel,
  jsonSerializer: gl_personJsonSerializer,
} = require('./gl_person');

// model
const modelName = 'or_order_consolidated';
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
    remainingQuantity: {
      type: Sequelize.DECIMAL(16, 3),
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
  as: 'orOrdersConsolidated',
});
MyModel.belongsTo(GL_ProductModel, {
  foreignKey: 'glProductId',
  as: 'glProduct',
});
GL_UnitModel.hasMany(MyModel, {
  foreignKey: 'glUnitId',
  as: 'orOrdersConsolidated',
});
MyModel.belongsTo(GL_UnitModel, {
  foreignKey: 'glUnitId',
  as: 'glUnit',
});
GL_PersonModel.hasMany(MyModel, {
  foreignKey: 'glPersonDestinationId',
  as: 'orOrdersConsolidated',
});
MyModel.belongsTo(GL_PersonModel, {
  foreignKey: 'glPersonDestinationId',
  as: 'glPersonDestination',
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
    glPerson: async (value, scopeName) =>
      await gl_personJsonSerializer(value, scopeName),
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
