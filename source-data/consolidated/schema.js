exports.schema = {
  Origem: {
    prop: 'origin',
    type: String,
  },
  Hospital: {
    prop: 'personName',
    type: String,
    parse: value => value.replace(/(.*)(\s-[\w\s]+)$/, '$1').toLowerString(),
  },
  Item: {
    prop: 'productName',
    type: String,
  },
  Quantidade: {
    prop: 'quantity',
    type: Number,
  },
  Unidade: {
    prop: 'unitName',
    type: String,
  },
  Descrição: {
    prop: 'notes',
    type: String,
  },
  Tipo: {
    prop: 'type',
    type: String,
    oneOf: ['INSUMOS', 'EQUIPAMENTOS'],
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
  Cidade: {
    prop: 'cityName',
    type: String,
    parse: value => value.toLowerString(),
  },
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
  'Grau Prioridade COVID': {
    prop: 'covid19Priority',
    type: Number,
  },
  'Prioridade COVID19': {
    prop: 'isCovid19Priority',
    type: String,
    oneOf: ['SIM', 'NÃO'],
    parse: value => Boolean(value === 'SIM'),
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

const mockData = [
  {
    // glProductId
    productName: 'PROTETOR/ESCUDO FACIAL',
    // glUnitId
    unitName: 'Unidade(s)',
    // glPersonRequestingId
    personName: 'HOSPITAL PRONTO SOCORRO HPS',
    // remainingQuantity
    quantity: 600,
    // notes
    notes: 'Solicitação 16/04',
  },
  {
    productName: 'PROTETOR/ESCUDO FACIAL',
    unitName: 'Unidade(s)',
    personName: '9º bpm',
    quantity: 40,
    notes: 'Luiz Carlos solicitou',
  },
];
