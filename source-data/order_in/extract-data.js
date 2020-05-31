const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { uniqBy } = require('lodash');
const xlsxFile = require('read-excel-file/node');

const outputFile = path.join(__dirname, 'entity-list.json');
const inputFile = path.join(__dirname, '..', '20200530_Dados_Plataforma.xlsx');

const emptyParser = value => {
  if (!value) {
    return '';
  }
  return value;
};

const emptyParserFunc = otherParser => {
  return value => {
    value = emptyParser(value);
    if (otherParser) {
      value = otherParser(value);
    }
    return value;
  };
};

const schema = {
  NOME_AJUST: {
    prop: 'name',
    type: String,
    parse: emptyParserFunc(value => {
      return value.replace('\n', ' ');
    }),
  },
  CIDADE: {
    prop: 'city',
    type: String,
    parse: emptyParserFunc(),
  },
  ESTADO: {
    prop: 'state',
    type: String,
    parse: emptyParserFunc(),
  },
  ITEM: {
    prop: 'productName',
    type: String,
    parse: emptyParserFunc(),
  },
  'Soma de QTD': {
    prop: 'qty',
    type: String,
    parse: emptyParserFunc(value => parseFloat(value)),
  },
};

console.log(`Attempting to extract data from: ${inputFile}`);
const excelData = xlsxFile(inputFile, {
  schema,
  sheet: 'DEMANDAS',
})
  .then(({ rows, errors }) => {
    if (errors.length > 0) {
      console.log(chalk.red(errors));
    }
    return rows;
  })
  .then(writeToJSONFile)
  .catch(err => {
    console.log(chalk.red(err));
  });

function writeToJSONFile(data) {
  console.log(`Saving extracted date to: ${outputFile}`);
  return fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
}
