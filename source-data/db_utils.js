const chalk = require('chalk');
const { find, create, saveOnLog, LOG_TYPE } = require('./import_utils');

const PersonModelModule = require('../server/models/gl_person');
const PersonModel = PersonModelModule.model;
const PersonContactModelModule = require('../server/models/gl_person_contact');
const PersonContactModel = PersonContactModelModule.model;

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
exports.findOrCreateFirstPersonContact = findOrCreateFirstPersonContact;

exports.findOrCreatePerson = async ({
  name,
  cityId,
  priority,
  personTypeId,
  personParentId,
}) => {
  return await find(PersonModel, {
    where: { name, cityId },
    notFound: async () => {
      const personId = await create(PersonModel, {
        name,
        cityId,
        priority,
        legalType: PersonModelModule.LEGAL_TYPE_FAST_CRUD,
        personTypeId,
        personParentId,
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

/**
 * @typedef {object} Country
 * @property {object} country
 * @property {object} state
 */

/**
 * @returns {Country}
 */
exports.countryBRAAndStateRioGrandeDoSulCreate = async () => {
  const { model: CountryModel } = require('../server/models/gl_country');
  const { model: StateModel } = require('../server/models/gl_state');
  // country
  let [countryEntity, countryCreated] = await CountryModel.findOrCreate({
    where: {
      code: 'BRA',
    },
    defaults: {
      name: 'Brasil',
      priority: 1,
    },
  });
  if (countryCreated) {
    console.log(chalk.green(`Created ${countryEntity.name} country.`));
  }
  // state RS
  let [stateEntity, stateCreated] = await StateModel.findOrCreate({
    where: {
      code: '43',
      countryId: countryEntity.id,
    },
    defaults: {
      name: 'Rio Grande do Sul',
      initials: 'RS',
      priority: 1,
    },
  });
  if (stateCreated) {
    console.log(chalk.green(`Created ${stateEntity.name} state.`));
  }
  return {
    country: countryEntity,
    state: stateEntity,
  };
};

/**
 * @returns {Country}
 */
exports.countryBRAAndStateCreate = async stateInitials => {
  const { model: CountryModel } = require('../server/models/gl_country');
  const { model: StateModel } = require('../server/models/gl_state');
  // country
  let [countryEntity, countryCreated] = await CountryModel.findOrCreate({
    where: {
      code: 'BRA',
    },
    defaults: {
      name: 'Brasil',
      priority: 1,
    },
  });
  if (countryCreated) {
    console.log(chalk.green(`Created ${countryEntity.name} country.`));
  }
  // state
  const stateEntity = await StateModel.findOne({
    where: {
      initials: stateInitials,
      countryId: countryEntity.id,
    },
  });
  if (!stateEntity) {
    throw new Error(
      `State ${stateInitials} not found in country ${countryEntity.name}`
    );
  }
  return {
    country: countryEntity,
    state: stateEntity,
  };
};

/**
 * @returns {object}
 */
exports.findCityForBRA = async (cityName, stateInitials) => {
  const { model: CountryModel } = require('../server/models/gl_country');
  const { model: StateModel } = require('../server/models/gl_state');
  const { model: CityModel } = require('../server/models/gl_city');
  const {
    country: countryEntity,
    state: stateEntity,
  } = await this.countryBRAAndStateCreate(stateInitials);

  // city
  const cityEntity = await CityModel.findOne({
    where: {
      stateId: stateEntity.id,
      name: cityName,
    },
  });
  if (!cityEntity) {
    throw new Error(
      `City ${cityName} not found in state ${stateInitials} / ${countryEntity.name}`
    );
  }
  return cityEntity;
};

exports.findOrCreateOrder = async (
  personDestinationId,
  isRequest,
  effectiveDate,
  personOriginId
) => {
  const OrderModelModule = require('../server/models/or_order');
  const OrderModel = OrderModelModule.model;
  const now = new Date();
  const type = isRequest
    ? OrderModelModule.common.TYPE_REQUEST
    : OrderModelModule.common.TYPE_SUPPLY;
  return find(OrderModel, {
    where: personOriginId
      ? {
          glPersonDestinationId: personDestinationId,
          type: type,
          glPersonOriginId: personOriginId,
        }
      : {
          glPersonDestinationId: personDestinationId,
          type: type,
        },
    notFound: async () => {
      const contactId = await findOrCreateFirstPersonContact(
        personDestinationId
      );
      const contactOriginId = personOriginId
        ? await findOrCreateFirstPersonContact(personOriginId)
        : contactId;
      const orderId = await create(OrderModel, {
        glPersonDestinationId: personDestinationId,
        glPersonContactDestinationId: contactId,
        glPersonOriginId: personOriginId ? personOriginId : personDestinationId,
        glPersonContactOriginId: contactOriginId,
        type: type,
        status: OrderModelModule.common.STATUS_PROCESSED,
        needsReview: false,
        internalNotes: 'ORDEM CRIADA NA IMPORTAÇÃO DO EXCEL',
        effectiveDate: effectiveDate ? effectiveDate : now,
      });
      return orderId;
    },
  });
};

/**
 * @param {Array} personIdList
 */
exports.orderConsolidateByPersonIdList = async personIdList => {
  const OrderConsolidatedModelModule = require('../server/models/or_order_consolidated');
  for (let rowNumber = 0; rowNumber < personIdList.length; rowNumber++) {
    const personId = personIdList[rowNumber];
    await OrderConsolidatedModelModule.consolidateByPersonDestination(personId);
  }
};
