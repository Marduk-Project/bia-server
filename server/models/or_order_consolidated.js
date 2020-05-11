const nconf = require('nconf');
const { Sequelize, DataTypes, Op } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');
const _ = require('lodash');

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
    requestQuantity: {
      type: Sequelize.DECIMAL(16, 3),
    },
    supplyReserveQuantity: {
      type: Sequelize.DECIMAL(16, 3),
    },
    supplyTransportQuantity: {
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
    maps: {
      glProduct: async (value, scopeName) =>
        await gl_productJsonSerializer(value, scopeName),
      glUnit: async (value, scopeName) =>
        await gl_unitJsonSerializer(value, scopeName),
      glPerson: async (value, scopeName) =>
        await gl_personJsonSerializer(value, scopeName),
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

const { model: OrderProductModel } = require('./or_order_product');
const { model: OrderModel, common: OrderModelCommon } = require('./or_order');

/**
 * @param {object} where
 * @param {int} where.glPersonDestinationId
 * @param {int} where.glProductId
 * @param {int} where.glUnitId
 * @param {int} where.glUnitId
 * @param {options} options
 * @returns {MyModel}
 */
const consolidateOrderProduct = async (
  glPersonDestinationId,
  orderProduct,
  options
) => {
  let orderConsolidated = await MyModel.findOne({
    where: {
      glPersonDestinationId: glPersonDestinationId,
      glProductId: orderProduct.glProductId,
      glUnitId: orderProduct.glUnitId,
    },
  });
  if (!orderConsolidated) {
    orderConsolidated = MyModel.build({
      glPersonDestinationId: glPersonDestinationId,
      glProductId: orderProduct.glProductId,
      glUnitId: orderProduct.glUnitId,
    });
  }
  const orderProductList = await OrderProductModel.findAll({
    where: {
      glProductId: orderProduct.glProductId,
      glUnitId: orderProduct.glUnitId,
    },
    include: [
      {
        association: 'order',
        attributes: ['id', 'glPersonDestinationId', 'type', 'status'],
        where: {
          glPersonDestinationId: glPersonDestinationId,
          status: {
            [Op.in]: [OrderModelCommon.STATUS_PROCESSED],
          },
          type: {
            [Op.in]: [
              OrderModelCommon.TYPE_SUPPLY,
              OrderModelCommon.TYPE_REQUEST,
              OrderModelCommon.TYPE_SUPPLY_RESERVE,
              OrderModelCommon.TYPE_SUPPLY_TRANSPORT,
              OrderModelCommon.TYPE_MANUAL_ADJUST,
            ],
          },
        },
      },
    ],
  });
  orderConsolidated.requestQuantity = 0;
  orderConsolidated.supplyReserveQuantity = 0;
  orderConsolidated.supplyTransportQuantity = 0;
  let foundCurrentItem = false;
  const calcItem = async item => {
    if (item.id == orderProduct.id) {
      foundCurrentItem = true;
    }
    const order = await findOrder(item);
    switch (parseInt(order.type)) {
      case OrderModelCommon.TYPE_SUPPLY:
      case OrderModelCommon.TYPE_MANUAL_ADJUST:
        orderConsolidated.requestQuantity -= parseFloat(item.quantity);
        break;

      case OrderModelCommon.TYPE_REQUEST:
        orderConsolidated.requestQuantity += parseFloat(item.quantity);
        break;

      case OrderModelCommon.TYPE_SUPPLY_TRANSPORT:
        orderConsolidated.supplyTransportQuantity += parseFloat(item.quantity);
        orderConsolidated.requestQuantity -= parseFloat(item.quantity);
        break;

      case OrderModelCommon.TYPE_SUPPLY_RESERVE:
        orderConsolidated.supplyReserveQuantity += parseFloat(item.quantity);
        orderConsolidated.requestQuantity -= parseFloat(item.quantity);
        break;
    }
  };
  for (const idx in orderProductList) {
    const item = orderProductList[idx];
    await calcItem(item);
  }
  if (!foundCurrentItem) {
    // implementation to try to fix database transactions
    await calcItem(orderProduct);
  }
  await orderConsolidated.save({
    transaction: options ? options.transaction : undefined,
  });
  return orderConsolidated;
};
exports.consolidateOrderProduct = consolidateOrderProduct;

/**
 * @param {object} where
 * @param {object} where.idList
 * @param {object} where.glPersonDestinationId
 * @param {object} options
 */
const clearConsolidatedNotInIdList = async (where, options) => {
  const consolidatedList = await MyModel.findAll({
    where: {
      id: {
        [Op.notIn]: where.idList,
      },
      glPersonDestinationId: where.glPersonDestinationId,
    },
  });
  await Promise.all(
    consolidatedList.map(async item => {
      item.requestQuantity = 0;
      item.supplyReserveQuantity = 0;
      item.supplyTransportQuantity = 0;
      await item.save({
        transaction: options ? options.transaction : undefined,
      });
    })
  );
};

const findOrder = async entity => {
  let order = null;
  if (!entity.order) {
    order = await OrderModel.findByPk(entity.orderId);
  } else {
    order = entity.order;
  }
  return order;
};

// TODO (Carlos - 07/mai/2020) review...  with hooks it was having to mutch bugs, null order and not getting some inserted itens from db.
// - Probably thats how the database works.

// const consolidateItemHook = async (entity, options) => {
//   const order = await findOrder(entity);
//   if (order.status == OrderModelCommon.STATUS_PROCESSED) {
//     await consolidateOrderProduct(order.glPersonDestinationId, entity, options);
//   }
// };

// OrderProductModel.addHook('afterSave', consolidateItemHook);
// OrderProductModel.addHook('afterDestroy', consolidateItemHook);

/**
 * @param {int} glPersonDestinationId
 * @param {options} options
 */
const consolidateByPersonDestination = async (
  glPersonDestinationId,
  options
) => {
  // find all orders by person
  const orderIdList = _.uniq(
    await OrderModel.findAll({
      where: {
        glPersonDestinationId: glPersonDestinationId,
        status: OrderModelCommon.STATUS_PROCESSED,
      },
      attributes: ['id', 'glPersonDestinationId', 'status'],
    }).map(item => item.id)
  );
  // get all order items reduced
  const orderProductList = await OrderProductModel.findAll({
    where: {
      orderId: {
        [Op.in]: orderIdList,
      },
    },
    include: ['order'],
  });
  // consolidate all items
  const changedIdList = [];
  for (const idx in orderProductList) {
    const orderProduct = orderProductList[idx];
    const orderConsolidated = await consolidateOrderProduct(
      glPersonDestinationId,
      orderProduct,
      options
    );
    changedIdList.push(orderConsolidated.id);
  }
  // clear all others
  await clearConsolidatedNotInIdList(
    {
      idList: changedIdList,
      glPersonDestinationId: glPersonDestinationId,
    },
    options
  );
};
exports.consolidateByPersonDestination = consolidateByPersonDestination;

// check if needs to recalc person
OrderModel.addHook('beforeSave', async (entity, options) => {
  if (entity.id) {
    // person changed, needs to recalc
    if (
      entity.previous('glPersonDestinationId') !=
        entity.glPersonDestinationId &&
      entity.previous('status') == OrderModelCommon.STATUS_PROCESSED
    ) {
      // consolidate old person
      await consolidateByPersonDestination(
        entity.previous('glPersonDestinationId'),
        options
      );
    }
  }
});
