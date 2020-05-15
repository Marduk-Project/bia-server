const chalk = require('chalk');
const { find, create, addToLogFile, LOG_TYPE } = require('../import_utils');

const { model: CityModel } = require('../../server/models/gl_city');
const {
  model: PersonTypeModel,
} = require('../../server/models/gl_person_type');
const { model: PersonModel } = require('../../server/models/gl_person');
const { model: UnitModel } = require('../../server/models/gl_unit');
const { model: ProductModel } = require('../../server/models/gl_product');
const { model: OrderModel } = require('../../server/models/or_order');
const {
  model: OrderProductModel,
} = require('../../server/models/or_order_product');

exports.findCity = function findCity(name) {
  return find(CityModel, {
    where: { name },
  });
};

exports.findOrCreatePersonType = async function findOrCreatePersonType(
  name,
  cityId,
  priority
) {
  return find(PersonTypeModel, {
    where: { name, cityId },
    notFound: () => create(PersonTypeModel, { name, cityId, priority }),
  });
};

exports.findOrCreatePerson = async function findOrCreatePerson(
  name,
  cityId,
  priority
) {
  return find(PersonModel, {
    where: { name, cityId },
    notFound: () => {
      const personId = create(PersonModel, {
        name,
        cityId,
        priority,
        legalType: 6,
      });
      addToLogFile(
        LOG_TYPE.WARNING,
        `
        Incomplete Person created:
        id: ${personId}
        name: ${name}
        cityId: ${cityId}
        priority: ${priority}
        legalType: 6
        `
      );
      return personId;
    },
  });
};

exports.findOrCreateUnit = async function findOrCreateUnit(name) {
  return find(UnitModel, {
    where: { name },
    notFound: () =>
      create(UnitModel, {
        name: name === 'Unidade(s)' ? 'Unidade(s)' : 'Litro(s)',
        nameSingular: name === 'Unidade(s)' ? 'Unidade' : 'Litro',
        namePlural: name === 'Unidade(s)' ? 'Unidades' : 'Litros',
      }),
  });
};

exports.findOrCreateProduct = async function findOrCreateProduct(
  name,
  unitId,
  consumable
) {
  return find(ProductModel, {
    where: { name },
    notFound: () => {
      const productId = create(ProductModel, {
        name,
        unitId,
        consumable,
      });
      addToLogFile(
        LOG_TYPE.WARNING,
        `
        Incomplete product created:
        id: ${productId}
        name: ${name}
        unitId: ${unitId}
        consumable: ${consumable}
        `
      );
      return productId;
    },
  });
};

exports.findOrCreateOrder = async function findOrCreateOrder(
  destinationPersonId
) {
  return find(OrderModel, {
    where: { destinationPersonId, type: 1 },
    notFound: () => {
      const orderId = create(OrderModel, {
        destinationPersonId,
        type: 1,
        status: 4,
      });
      addToLogFile(
        LOG_TYPE.WARNING,
        `
        Incomplete order created:
        id: ${orderId}
        destinationPersonId: ${destinationPersonId},
        type: 1,
        status: 4,
        `
      );
      return orderId;
    },
  });
};

exports.createOrAddOrderProduct = async function createOrAddOrderProduct({
  orderId,
  productId,
  unitId,
  notes,
  requestQuantity,
}) {
  const orderProductId = await find(OrderProductModel, {
    where: { orderId, productId, unitId },
    notFound: () => {
      const productOrderId = create(OrderProductModel, {
        orderId,
        productId,
        unitId,
        notes,
        requestQuantity,
      });
      addToLogFile(
        LOG_TYPE.WARNING,
        `
        Incomplete Product Order created:
        id: ${productOrderId}
        orderId: ${orderId}
        productId: ${productId}
        unitId: ${unitId}
        notes: ${notes}
        requestQuantity: ${requestQuantity}
        `
      );
      return productOrderId;
    },
  });

  OrderProductModel.increment(
    {
      requestQuantity: requestQuantity,
    },
    { where: { id: orderId } }
  );
  return orderProductId;
};
