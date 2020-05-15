const fs = require('fs');
const path = require('path');
const xlsxFile = require('read-excel-file/node');

const filePath = path.join(__dirname, '..', 'Consolidado_Demandas_1904.xlsx');
const outputPath = path.join(__dirname, 'consolidated.json');

const { schema } = require('./schema');

console.log(`Attempting to extract data from: ${filePath}`);
xlsxFile(filePath, {
  schema,
  sheet: '0.Consolidado_BOLETIM',
})
  .then(({ rows }) => rows)
  .then(writeToJSONFile);

function writeToJSONFile(data) {
  console.log(`Saving extracted date to: ${outputPath}`);
  return fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}
