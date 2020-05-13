exports.schemaMapToDB = {
  origin: {},
  quantity: {
    modelName: 'orOrderConsolidated',
    modelField: 'requestQuantity',
  },
  notes: {
    modelName: 'OrOrderConsolidated',
    modelField: 'notes',
  },

  productName: {
    modelName: 'glProduct',
    modelField: 'name',
  },
  type: {
    modelName: 'glProduct',
    modelField: 'consumable',
    parse: value => (value === 'INSUMOS' ? true : false),
  },

  unitName: {
    modelName: 'glUnit',
    modelField: 'name',
  },

  personName: {
    modelName: 'glPersonDestination',
    modelField: 'name',
  },
  covid19Priority: {
    modelName: 'glPersonDestination',
    modelField: 'priority',
  },

  personType: {
    modelName: 'glPersonType',
    modelField: 'name',
  },
  isCovid19Priority: {
    modelName: 'glPersonType',
    modelField: 'priority',
    parse: value => (value === 'SIM' ? 1 : 0),
  },

  cityName: {
    modelName: 'glCity',
    modelField: 'name',

    parentModel: '',
    fieldId: 'cityId',
  },

  size: {},
  needsIn30Days: {},
  urgencyPriority: {},
  itemPriority: {},
  originalRequest: {},
  demandCorrection: {},
  donarionsCorrection: {},
  donarionsDelivered: {},
  urgency: {},
};
