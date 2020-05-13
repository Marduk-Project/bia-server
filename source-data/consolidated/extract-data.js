const fs = require('fs');
const path = require('path');
const xlsxFile = require('read-excel-file/node');

const filePath = path.join(__dirname, '..', 'Consolidado_Demandas_1904.xlsx');
const outputPath = path.join(__dirname, 'consolidated.json');

const USE_MOCK_DATA = !true;
const { schema, mockData } = require('./schema');

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

// function getBreakdownToMatch(input) {
//   const breakdown = [
//     { key: 'productName', model: 'gl_product' },
//     { key: 'unitName', model: 'gl_unit' },
//     { key: 'personName', model: 'gl_person' },
//   ].map(item => {
//     return { ...item, list: [], modelField: item.modelField || 'name' };
//   });

//   input.forEach(row => {
//     breakdown.forEach(({ key, list }) => {
//       // create list for each type of unique values
//       // to avoid requesting to the db for the same ids.
//       if (list.includes(row[key])) return;
//       list.push({ name: row[key] });
//     });
//   });

//   return breakdown;
// }
