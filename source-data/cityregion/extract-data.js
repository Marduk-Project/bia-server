const fs = require('fs');
const path = require('path');
const { uniqBy } = require('lodash');
const xlsxFile = require('read-excel-file/node');

const filePath = path.join(__dirname, '..', 'Regioes_-_SMS_ajustado.xlsx');
const outputPath = path.join(__dirname, 'rs_cities_regions.json');

const schema = {
  Cidade_Ajustada: {
    prop: 'name',
    type: String,
  },
  'Macrorregião de Saúde': {
    prop: 'macroRegion',
    type: String,
  },
  'Coordenadoria Regional de Saúde': {
    prop: 'healthCoordenationRegion',
    type: String,
  },
  'Região de Saúde': {
    prop: 'healthRegion',
    type: String,
  },
};

console.log(`Attempting to extract data from: ${filePath}`);
const excelData = xlsxFile(filePath, {
  schema,
  sheet: 'ajust',
})
  .then(({ rows, errors }) => {
    rows = rows.map(item => {
      item.name = item.name.replace('\n', ' ');
      return item;
    });
    return rows;
  })
  .then(rows => {
    const splitList = rows.filter(item => item.name.includes(' e '));
    rows = rows.filter(item => !item.name.includes(' e '));
    splitList.forEach(item => {
      const cp = Object.assign({}, item);
      item.name = item.name.split(' e ')[0];
      cp.name = cp.name.split(' e ')[1];
      rows.push(item);
      rows.push(cp);
    });
    // rows = rows.map((item) => {
    //   item.healthRegion = item.healthRegion.replace("\n", " ");
    //   return item;
    // });
    return rows;
  })
  .then(writeToJSONFile);

function writeToJSONFile(data) {
  console.log(`Saving extracted date to: ${outputPath}`);
  return fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}
