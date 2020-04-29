const xlsxFile = require('read-excel-file/node');

const USE_MOCK_DATA = true;
let excelData;

const schema = {
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
    // Should we assume "Unidade(s) is the default"
    // ---
    // parse(value) {
    //   return value === 'Unidade(s)' ||
    //     value === 'Litro(s)' ||
    //     value === 'Sache(s)'
    //     ? 'Unidade(s)'
    //     : value;
    // },
  },
  Descrição: {
    prop: 'notes',
    type: String,
  },

  // Tipo: {
  //   prop: 'type',
  //   type: String,
  //   oneOf: ['INSUMOS', 'EQUIPAMENTOS'],
  // },
  // This is not needed anymore, is it?
  // ---
  //   Origin: {
  //     prop: 'origin',
  //     type: String,
  //   },
  // Seems like it's always 0 or null
  // ---
  //   Tamanho: {
  //     prop: 'size',
  //     type: String,
  //   },
  // Necessidade: {
  //   prop: 'size',
  //   type: String,
  //   parse: (value) => Number(value.replace(/[^\w]/g, '')),
  // },
  // 'necessidade 30 dias': {
  //   prop: 'needsIn30Days',
  //   type: String,
  //   parse: (value) => Number(value.replace(/[^\w]/g, '')),
  // },
  // URGÊNCIA_CLASSIF: {
  //   prop: 'urgencyPriority',
  //   type: Number,
  //   parse: Boolean,
  // },
  // 'Prioridade do Item': {
  //   prop: 'itemPriority',
  //   type: String,
  //   oneOf: ['Não prioritário', 'Prioritário'],
  //   parse: (value) => Boolean(value === 'Prioritário'),
  // },
  // Cidade: {
  //   prop: 'cityName',
  //   type: String,
  //   parse: (value) => value.toLowerString(),
  // },
  // 'Tipo Solicitante': {
  //   prop: 'personType',
  //   type: String,
  //   oneOf: [
  //     'HOSPITAIS',
  //     'SEGURANÇA PÚBLICA',
  //     'PREFEITURAS/SECRETARIAS',
  //     'OUTROS',
  //   ],
  // },
  // 'Grau Prioridade COVID': {
  //   prop: 'covid19Priority',
  //   type: Number,
  // },
  // 'Prioridade COVID19': {
  //   prop: 'isCovid19Priority',
  //   type: String,
  //   oneOf: ['SIM', 'NÃO'],
  //   parse: (value) => Boolean(value === 'SIM'),
  // },
  // 'Solicitação Original': {
  //   prop: 'originalRequest',
  //   type: Number,
  // },
  // 'Correção de demanda': {
  //   prop: 'demandCorrection',
  //   type: Number,
  // },
  // 'Correção Doações': {
  //   prop: 'donarionsCorrection',
  //   type: Number,
  // },
  // 'Doações entregues': {
  //   prop: 'donarionsDelivered',
  //   type: Number,
  // },
  // Urgência: {
  //   prop: 'urgency',
  //   type: String,
  //   oneOf: ['IMEDIATO', '30 DIAS'],
  // },
};

// Disabled for development performance
// ---
// xlsxFile('./Consolidado_Demandas_1904.xlsx', {
//   sheet: '0.Consolidado_BOLETIM',
//   schema,
// }).then(({ rows, errors }) => {
//   rows.length = 2;
//   console.log(JSON.stringify(rows, null, 2));
//   excelData = rows;
// });

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

function getBreakdownToMatch() {
  const input = USE_MOCK_DATA ? mockData : excelData;

  const breakdown = [
    { key: 'productName', model: 'gl_product' },
    { key: 'unitName', model: 'gl_unit' },
    { key: 'personName', model: 'gl_person' },
  ].map(item => {
    return { ...item, list: [], modelField: item.modelField || 'name' };
  });

  input.forEach(row => {
    breakdown.forEach(({ key, list }) => {
      // create list for each type of unique values
      // to avoid requesting to the db for the same ids.
      if (list.includes(row[key])) return;
      list.push({ name: row[key] });
    });
  });

  return breakdown;
}

exports.excelData = USE_MOCK_DATA ? mockData : excelData;
exports.breakdownToMatch = getBreakdownToMatch();
