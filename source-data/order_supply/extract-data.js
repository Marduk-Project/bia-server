const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { uniqBy } = require('lodash');
const xlsxFile = require('read-excel-file/node');

const outputFile = path.join(__dirname, 'data-list.json');
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
  ENTIDADE_AJUST: {
    prop: 'name',
    type: String,
    parse: emptyParserFunc(value => {
      return value.replace('\n', ' ');
    }),
  },
  Cidade: {
    prop: 'city',
    type: String,
    parse: emptyParserFunc(),
  },
  ESTADO: {
    prop: 'state',
    type: String,
    parse: emptyParserFunc(),
  },
  'Tipo de Material': {
    prop: 'productName',
    type: String,
    parse: emptyParserFunc(),
  },
  'Soma de Quantidade': {
    prop: 'qty',
    type: String,
    parse: emptyParserFunc(value => parseFloat(value)),
  },
  Entidade_Doadora: {
    prop: 'originName',
    type: String,
    parse: emptyParserFunc(),
  },
  Cidade_Doador: {
    prop: 'originCity',
    type: String,
    parse: emptyParserFunc(),
  },
  Estado_doador: {
    prop: 'originState',
    type: String,
    parse: emptyParserFunc(),
  },
  'Data Conclusão': {
    prop: 'effectiveDate',
    type: Date,
    parse: emptyParserFunc(),
  },
};

console.log(`Attempting to extract data from: ${inputFile}`);
const excelData = xlsxFile(inputFile, {
  schema,
  sheet: 'ENTREGAS',
})
  .then(({ rows, errors }) => {
    if (errors.length > 0) {
      console.log(chalk.red(errors));
    }
    writeToJSONFile(rows);
    writeToJSONFile(
      {
        total: rows.length,
      },
      'meta.json'
    );
    return rows;
  })
  .catch(err => {
    console.log(chalk.red(err));
  });

function writeToJSONFile(data, output) {
  if (!output) {
    output = outputFile;
  } else {
    output = path.join(__dirname, output);
  }
  console.log(`Saving extracted date to: ${output}`);
  return fs.writeFileSync(output, JSON.stringify(data, null, 2));
}
