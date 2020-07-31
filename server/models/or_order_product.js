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
  common: OrderCommon,
} = require('./or_order');

// model
const modelName = 'or_order_product';
class MyModel extends BaseModel {
  /**
   * Saves the product
   * @param {object} where
   * @param {object} where.order
   * @param {object} where.product
   * @param {object} data
   * @param {double} data.quantity
   * @param {double} data.notes
   * @param {object} options
   */
  static async saveOrderProduct(
    { order, product },
    { quantity, notes },
    options
  ) {
    let entity = await MyModel.findOne({
      where: {
        orderId: order.id,
        glProductId: product.id,
        glUnitId: product.unitId,
      },
    });
    if (!entity) {
      entity = MyModel.build();
      entity.glProductId = product.id;
      entity.orderId = order.id;
      entity.glUnitId = product.unitId;
    }
    entity.quantity = quantity;
    entity.notes = notes;
    await entity.save(options);
    return entity;
  }

  /**
   * @param {Number} orderId
   * @param {object} product
   */
  static async findByProduct(orderId, product) {
    return await MyModel.findOne({
      where: {
        orderId: orderId,
        glProductId: product.id,
        glUnitId: product.unitId,
      },
    });
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
  as: 'orOrderProducts',
});
MyModel.belongsTo(GL_ProductModel, {
  foreignKey: 'glProductId',
  as: 'glProduct',
});
GL_UnitModel.hasMany(MyModel, {
  foreignKey: 'glUnitId',
  as: 'orOrderProducts',
});
MyModel.belongsTo(GL_UnitModel, {
  foreignKey: 'glUnitId',
  as: 'glUnit',
});
OrderModel.hasMany(MyModel, {
  foreignKey: 'orderId',
  as: 'glProducts',
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
    maps: {
      glProduct: async (value, scopeName) =>
        await gl_productJsonSerializer(value, scopeName),
      glUnit: async (value, scopeName) =>
        await gl_unitJsonSerializer(value, scopeName),
      order: async (value, scopeName) =>
        await orderJsonSerializer(value, scopeName),
    },
  },
  account: {
    include: [
      'id',
      'quantity',
      'notes',
      'glProductId',
      'glProduct',
      'glUnitId',
      'glUnit',
      'orderId',
    ],
    maps: {
      glProduct: async (value, scopeName) =>
        await gl_productJsonSerializer(value, scopeName),
      glUnit: async (value, scopeName) =>
        await gl_unitJsonSerializer(value, scopeName),
      order: async (value, scopeName) =>
        await orderJsonSerializer(value, scopeName),
    },
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
