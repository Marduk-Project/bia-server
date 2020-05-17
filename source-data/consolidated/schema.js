// Ordered by "import to db"
exports.schema = {
  // glCity
  Cidade: {
    prop: 'cityName',
    type: String,
    parse: value => value.toLowerCase(),
  },

  // glPersonType
  'Tipo Solicitante': {
    prop: 'personType',
    type: String,
    oneOf: [
      'HOSPITAIS',
      'SEGURANÇA PÚBLICA',
      'PREFEITURAS/SECRETARIAS',
      'OUTROS',
    ],
  },
  'Prioridade COVID19': {
    prop: 'personTypePriority',
    type: String,
    oneOf: ['SIM', 'NÃO'],
    parse: value => Number(value === 'SIM'),
  },

  // Person
  Hospital: {
    prop: 'personName',
    type: String,
    parse: value => value.replace(/(.*)(\s-[\w\s]+)$/, '$1'),
  },
  'Grau Prioridade COVID': {
    prop: 'personPriority',
    type: Number,
  },

  // Unit
  Unidade: {
    prop: 'unitName',
    type: String,
  },

  // Product
  Item: {
    prop: 'productName',
    type: String,
  },
  Tipo: {
    prop: 'isConsumable',
    type: String,
    oneOf: ['INSUMOS', 'EQUIPAMENTOS'],
    parse: value => Boolean(value === 'INSUMOS'),
  },

  // Order

  // Order Product
  Quantidade: {
    prop: 'requestQuantity',
    type: Number,
  },
  Descrição: {
    prop: 'orderProductNotes',
    type: String,
  },

  // Not used in the tables
  Origem: {
    prop: 'origin',
    type: String,
  },
  Tamanho: {
    prop: 'size',
    type: String,
  },
  Necessidade: {
    prop: 'necessity',
    type: String,
    parse: value => Number(value.replace(/[^\w]/g, '')),
  },
  'necessidade 30 dias': {
    prop: 'needsIn30Days',
    type: String,
    parse: value => Number(value.replace(/[^\w]/g, '')),
  },
  URGÊNCIA_CLASSIF: {
    prop: 'urgencyPriority',
    type: Number,
    parse: Boolean,
  },
  'Prioridade do Item': {
    prop: 'itemPriority',
    type: String,
    oneOf: ['Não prioritário', 'Prioritário'],
    parse: value => Boolean(value === 'Prioritário'),
  },
  'Solicitação Original': {
    prop: 'originalRequest',
    type: Number,
  },
  'Correção de demanda': {
    prop: 'demandCorrection',
    type: Number,
  },
  'Correção Doações': {
    prop: 'donarionsCorrection',
    type: Number,
  },
  'Doações entregues': {
    prop: 'donarionsDelivered',
    type: Number,
  },
  Urgência: {
    prop: 'urgency',
    type: String,
    oneOf: ['IMEDIATO', '30 DIAS'],
  },

  'Região - DRE': {
    prop: 'healthRegion',
    type: String,
  },
  Microrregião: {
    prop: 'microRegion',
    type: String,
  },
  Mesorregião: {
    prop: 'macroRegion',
    type: String,
  },
  PÁGINA: {
    prop: 'page',
    type: String,
  },
  Chave: {
    prop: 'key',
    type: String,
  },
  'Quantidade Corrigida': {
    prop: 'correctedQuantity',
    type: String,
  },
  Gerência_Distrital_POA: {
    prop: 'POA_district_management',
    type: String,
  },
  Gestão_POA: {
    prop: 'POA_management',
    type: String,
  },
};
