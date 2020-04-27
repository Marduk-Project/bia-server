const xlsxFile = require("read-excel-file/node");

const schema = {
  // This is not needed anymore, is it?
  // ---
  //   Origin: {
  //     prop: 'origin',
  //     type: String,
  //   },
  Hospital: {
    prop: "person",
    type: String,
    parse: (value) => value.replace(/(.*)(\s-[\w\s]+)$/, "$1").toLowerString(),
  },
  Item: {
    prop: "productName",
    type: String,
  },
  Tipo: {
    prop: "type",
    type: String,
    oneOf: ["INSUMOS", "EQUIPAMENTOS"],
  },
  Descrição: {
    prop: "note",
    type: String,
  },
  Quantidade: {
    prop: "quantity",
    type: Number,
  },
  // Seems like it's always 0 or null
  // ---
  //   Tamanho: {
  //     prop: 'size',
  //     type: String,
  //   },
  Necessidade: {
    prop: "size",
    type: String,
    parse: (value) => Number(value.replace(/[^\w]/g, "")),
  },
  "necessidade 30 dias": {
    prop: "needsIn30Days",
    type: String,
    parse: (value) => Number(value.replace(/[^\w]/g, "")),
  },
  URGÊNCIA_CLASSIF: {
    prop: "urgencyPriority",
    type: Number,
    parse: Boolean,
  },
  Unidade: {
    prop: "unitType",
    type: String,
    // Check how to normalize, multiply by quantity
    // ---
    // parse(value) {
    //   return value === 'Unidade(s)' ||
    //     value === 'Litro(s)' ||
    //     value === 'Sache(s)'
    //     ? ''
    //     : value;
    // },
  },
  "Prioridade do Item": {
    prop: "itemPriority",
    type: String,
    oneOf: ["Não prioritário", "Prioritário"],
    parse: (value) => Boolean(value === "Prioritário"),
  },
  Cidade: {
    prop: "cityName",
    type: String,
    parse: (value) => value.toLowerString(),
  },
  "Tipo Solicitante": {
    prop: "personType",
    type: String,
    oneOf: [
      "HOSPITAIS",
      "SEGURANÇA PÚBLICA",
      "PREFEITURAS/SECRETARIAS",
      "OUTROS",
    ],
  },
  "Grau Prioridade COVID": {
    prop: "covid19Priority",
    type: Number,
  },
  "Prioridade COVID19": {
    prop: "isCovid19Priority",
    type: String,
    oneOf: ["SIM", "NÃO"],
    parse: (value) => Boolean(value === "SIM"),
  },
  "Solicitação Original": {
    prop: "originalRequest",
    type: Number,
  },
  "Correção de demanda": {
    prop: "demandCorrection",
    type: Number,
  },
  "Correção Doações": {
    prop: "donarionsCorrection",
    type: Number,
  },
  "Doações entregues": {
    prop: "donarionsDelivered",
    type: Number,
  },
  Urgência: {
    prop: "urgency",
    type: String,
    oneOf: ["IMEDIATO", "30 DIAS"],
  },
};

// Disabled for development performance
// ---
// xlsxFile('./Consolidado_Demandas_1904.xlsx', {
//   sheet: '0.Consolidado_BOLETIM',
//   schema,
// }).then(({ rows, errors }) => {
//   rows.length = 2;
//   console.log(JSON.stringify(rows, null, 2));
// });

const mockData = [
  {
    person: "hospital pronto socorro hps - porto alegre",
    productName: "PROTETOR/ESCUDO FACIAL",
    type: "INSUMOS",
    note: "Solicitação 16/04",
    quantity: 600,
    size: 0,
    needsIn30Days: 0,
    urgencyPriority: 1,
    unitType: "Unidade(s)",
    itemPriority: "Prioritário",
    cityName: "porto alegre",
    personType: "HOSPITAIS",
    covid19Priority: 0,
    isCovid19Priority: "SIM",
    originalRequest: 600,
    demandCorrection: 0,
    donarionsCorrection: 0,
    page: 1,
  },
  {
    person: "9º bpm - porto alegre",
    productName: "PROTETOR/ESCUDO FACIAL",
    type: "INSUMOS",
    note: "Luiz Carlos solicitou",
    quantity: 40,
    urgencyPriority: 1,
    unitType: "Unidade(s)",
    itemPriority: "Prioritário",
    cityName: "novo hamburgo",
    personType: "SEGURANÇA PÚBLICA",
    covid19Priority: 0,
    isCovid19Priority: "SIM",
    page: 1,
  },
];

// Normalize Unit*Quantity

function getBreakdownToMatch(input = mockData) {
  const breakdown = [
    { key: "person", model: "gl_person", modelField: "name", list: [] },
    // { key: 'productName', model: 'gl_person', list: [] },
    // { key: 'type', model: 'gl_person', list: [] },
    // { key: 'urgencyPriority', model: 'gl_person', list: [] },
    // { key: 'unitType', model: 'gl_person', list: [] },
    // { key: 'itemPriority', model: 'gl_person', list: [] },
    { key: "cityName", model: "gl_city", modelField: "name", list: [] },
    // { key: 'personType', model: 'gl_person', list: [] },
    // { key: 'covid19Priority', model: 'gl_person', list: [] },
    // { key: 'isCovid19Priority', model: 'gl_person', list: [] },
  ];

  input.forEach((row) => {
    breakdown.forEach((breakdownItem) => {
      if (breakdownItem.list.includes(row[breakdownItem.key])) return;
      breakdownItem.list.push({ name: row[breakdownItem.key] });
    });
  });

  return breakdown;
}

exports.mockData = mockData;
exports.breakdownToMatch = getBreakdownToMatch();
