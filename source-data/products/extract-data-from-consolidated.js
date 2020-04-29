const fs = require('fs');
const { uniqBy } = require('lodash');
const xlsxFile = require('read-excel-file/node');

const schema = {
  Item: {
    prop: 'name',
    type: String,
  },
  'Prioridade do Item': {
    prop: 'isPriority',
    type: String,
    parse(value) {
      return value === 'Prioritário';
    },
  },
  Tipo: {
    prop: 'type',
    type: String,
    oneOf: ['INSUMOS', 'EQUIPAMENTOS'],
  },
};

console.log(
  'Attempting to extract data from: ./Consolidado_Demandas_1904.xlsx'
);
const excelData = xlsxFile('../Consolidado_Demandas_1904.xlsx', {
  sheet: '0.Consolidado_BOLETIM',
  schema,
})
  .then(({ rows, errors }) => rows)
  .then(rows => uniqBy(rows, 'name'))
  .then(rows => rows.filter(row => Boolean(row.name && row.type)))
  .then(writeToJSONFile);

function writeToJSONFile(data) {
  console.log(
    'Saving extracted date to: ./products-list-from-consolidated.json'
  );
  return fs.writeFileSync(
    './products-list-from-consolidated.json',
    JSON.stringify(data, null, 2)
  );
}
