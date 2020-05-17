const fs = require('fs');
const path = require('path');
const xlsxFile = require('read-excel-file/node');

const filePath = path.join(__dirname, '..', 'Consolidado_Demandas_1904.xlsx');
const outputPath = path.join(__dirname, 'consolidated.json');
const outputPathPersonType = path.join(__dirname, 'personTypeList.json');

const { schema } = require('./schema');

const personTypeList = [];

console.log(`Attempting to extract data from: ${filePath}`);
xlsxFile(filePath, {
  schema,
  sheet: '0.Consolidado_BOLETIM',
})
  .then(({ rows }) => rows)
  .then(rows => {
    return rows.filter(row => {
      if (!row.originalRequest) {
        return false;
      }
      if (!row.cityName) {
        return false;
      }
      if (!row.requestQuantity || row.requestQuantity <= 0) {
        return false;
      }
      return true;
    });
  })
  .then(rows => {
    rows.forEach(item => {
      if (item.personType && !personTypeList.includes(item.personType)) {
        personTypeList.push(item.personType);
      }
    });
    return rows;
  })
  .then(writeToJSONFile);

function writeToJSONFile(data) {
  console.log(`Saving extracted date to: ${outputPath}`);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  fs.writeFileSync(
    outputPathPersonType,
    JSON.stringify(personTypeList, null, 2)
  );
}
