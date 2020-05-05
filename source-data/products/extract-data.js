const fs = require('fs');
const path = require('path');
const { uniqBy } = require('lodash');
const xlsxFile = require('read-excel-file/node');

const outputFile = path.join(__dirname, 'products-list.json');
const inputFile = path.join(__dirname, 'products-list.xlsx');

const schema = {
  Item: {
    prop: 'name',
    type: String,
  },
  Unidade: {
    prop: 'unit',
    type: String,
    oneOf: ['Unidade(s)', 'Litro(s)', 'Caixa(s) com 100', 'Caixa(s) com 50'],
  },
  Prioridade: {
    prop: 'isPriority',
    type: String,
    oneOf: ['Prioritário', 'Não prioritário'],
  },
  Tipo: {
    prop: 'type',
    type: String,
    oneOf: ['INSUMOS', 'EQUIPAMENTOS'],
  },
};

console.log(`Attempting to extract data from: ${inputFile}`);
const excelData = xlsxFile(inputFile, {
  schema,
})
  .then(({ rows, errors }) => {
    return rows;
  })
  .then(rows => uniqBy(rows, 'name'))
  .then(rows => rows.filter(row => Boolean(row.name && row.type)))
  .then(writeToJSONFile);

function writeToJSONFile(data) {
  console.log(`Saving extracted date to: ${outputFile}`);
  return fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
}
