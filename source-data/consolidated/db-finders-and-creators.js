const chalk = require('chalk');
const { find, create, saveOnLog, LOG_TYPE } = require('../import_utils');

const { model: CityModel } = require('../../server/models/gl_city');
const {
  model: PersonTypeModel,
} = require('../../server/models/gl_person_type');
const PersonModelModule = require('../../server/models/gl_person');
const PersonModel = PersonModelModule.model;
const PersonContactModelModule = require('../../server/models/gl_person_contact');
const PersonContactModel = PersonContactModelModule.model;
const { model: UnitModel } = require('../../server/models/gl_unit');
const { model: ProductModel } = require('../../server/models/gl_product');
const OrderModelModule = require('../../server/models/or_order');
const OrderModel = OrderModelModule.model;
const {
  model: OrderProductModel,
} = require('../../server/models/or_order_product');

/**
 * Find or create first person contact id
 * @param {int} personId
 * @returns {int} personContactId
 */
const findOrCreateFirstPersonContact = async personId => {
  const contact = await PersonContactModel.findOne({
    where: {
      personId: personId,
    },
    order: [['id', 'asc']],
  });
  if (contact) {
    return contact.id;
  }
  return await create(PersonContactModel, {
    personId: personId,
    name: 'CRIADO NA IMPORTAÇÃO',
    level: PersonContactModelModule.LEVEL_NORMAL,
  });
};

exports.findOrCreatePerson = async (name, cityId, priority) => {
  return await find(PersonModel, {
    where: { name, cityId },
    notFound: async () => {
      const personId = await create(PersonModel, {
        name,
        cityId,
        priority,
        legalType: PersonModelModule.LEGAL_TYPE_FAST_CRUD,
      });
      await findOrCreateFirstPersonContact(personId);
      saveOnLog(
        LOG_TYPE.WARNING,
        `
        Incomplete Person created:
        id: ${personId}
        name: ${name}
        cityId: ${cityId}
        priority: ${priority}
        legalType: ${PersonModelModule.LEGAL_TYPE_FAST_CRUD}
        `
      );
      return personId;
    },
  });
};

exports.findOrCreateProduct = async (name, unitId, consumable) => {
  return find(ProductModel, {
    where: { name },
    notFound: async () => {
      const productId = await create(ProductModel, {
        name,
        unitId,
        consumable,
      });
      saveOnLog(
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

exports.findOrCreateOrder = async personDestinationId => {
  return find(OrderModel, {
    where: { glPersonDestinationId: personDestinationId, type: 1 },
    notFound: async () => {
      const contactId = await findOrCreateFirstPersonContact(
        personDestinationId
      );
      const orderId = await create(OrderModel, {
        glPersonDestinationId: personDestinationId,
        glPersonContactDestinationId: contactId,
        glPersonOriginId: personDestinationId,
        glPersonContactOriginId: contactId,
        type: OrderModelModule.common.TYPE_REQUEST,
        status: OrderModelModule.common.STATUS_NEW,
        needsReview: true,
        internalNotes: 'ORDEM CRIADA NA IMPORTAÇÃO DO EXCEL',
      });
      return orderId;
    },
  });
};
