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
  NOME_AJUSTADO: {
    prop: 'name',
    type: String,
    parse: emptyParserFunc(value => {
      return value.replace('\n', ' ');
    }),
  },
  MUNICÍPIO: {
    prop: 'city',
    type: String,
    parse: emptyParserFunc(),
  },
  ESTADO: {
    prop: 'state',
    type: String,
    parse: emptyParserFunc(),
  },
  'TIPO DE ENTIDADE': {
    prop: 'entityType',
    type: String,
    parse: emptyParserFunc(),
  },
  'PRIORITÁRIO P/ COVID/19?': {
    prop: 'priorityCovid',
    type: String,
    parse: emptyParserFunc(value => value == 'SIM'),
  },
  'NÍVEL DRE': {
    prop: 'priorityLevel',
    type: String,
    parse: emptyParserFunc(value => (value ? value : 0)),
  },
  'ENTIDADE PAI': {
    prop: 'parentEntityName',
    type: String,
    parse: emptyParserFunc(),
  },
};

console.log(`Attempting to extract data from: ${inputFile}`);
const excelData = xlsxFile(inputFile, {
  schema,
  sheet: 'Entidades',
})
  .then(({ rows, errors }) => {
    if (errors.length > 0) {
      console.log(chalk.red(errors));
    }
    console.log('Tamanho:', rows.length);
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

// address parser
// if (errors.length > 0) {
//   console.log(errors);
// }
// rows = rows.map(item => {
//   // city on name
//   if (item.name.endsWith(` - ${item.city}`)) {
//     item.name = item.name.substring(
//       0,
//       item.name.length - (item.city.length + 3)
//     );
//   }
//   item.name = item.name.trim();
//   // city on request manager
//   if (item.requestManager) {
//     if (item.requestManager.endsWith(` - ${item.city}`)) {
//       item.requestManager = item.requestManager.substring(
//         0,
//         item.requestManager.length - (item.city.length + 3)
//       );
//     }
//     item.requestManager = item.requestManager.trim();
//     if (item.requestManager == item.name) {
//       item.requestManager = null;
//     }
//   }
//   // address
//   if (item.address) {
//     let address = item.address;
//     if (address.includes('-')) {
//       const splited = address.split('-');
//       item.addressNeighborhood = splited[splited.length - 1].trim();
//       delete splited[splited.length - 1];
//       address = splited.join(' ');
//     }
//     if (address.includes('-')) {
//       const splited = address.split('-');
//       item.addressExtra = splited[splited.length - 1].trim();
//       delete splited[splited.length - 1];
//       address = splited.join(' ');
//     }
//     if (address.includes(',')) {
//       const splited = address.split(',');
//       item.addressStreet = splited[0].trim();
//       let nbr = splited[splited.length - 1].trim().toLowerCase();
//       if (nbr.toLowerCase().includes('bairro')) {
//         nbr = nbr.replace('bairro').trim();
//       }
//       if (!isNaN(nbr)) {
//         item.addressNumber = nbr;
//       }
//       delete splited[splited.length - 1];
//       address = splited.join(' ').trim();
//     }
//   }
//   // return
//   return item;
