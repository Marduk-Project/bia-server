const fs = require('fs');
const path = require('path');
const { uniqBy } = require('lodash');
const xlsxFile = require('read-excel-file/node');

const outputFile = path.join(__dirname, 'entity-list.json');
const inputFile = path.join(
  __dirname,
  '..',
  'Relacao_de_Entidades_-_01052020.xlsx'
);

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
  'NOME PADRÃO': {
    prop: 'name',
    type: String,
    parse: emptyParserFunc(),
  },
  MUNICÍPIO: {
    prop: 'city',
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
  'NÍVEL DRE - GRAU ATENDIMENTO COVID': {
    prop: 'priorityLevel',
    type: String,
    parse: emptyParserFunc(value => (value ? value : 0)),
  },
  'REGIÃO SAÚDE': {
    prop: 'macroRegion',
    type: String,
    parse: emptyParserFunc(value => value.toUpperCase()),
  },
  'TIPO DE PESSOA': {
    prop: 'personType',
    type: String,
    parse: emptyParserFunc(),
  },
  'GESTOR DA DEMANDA': {
    prop: 'requestManager',
    type: String,
    parse: emptyParserFunc(value => {
      if (value) {
        if (value.endsWith('- PORTO ALEGRE')) {
          value = value.substring(0, value.length - '- PORTO ALEGRE'.length);
        }
        value = value.trim();
      }
      return value;
    }),
  },
  'RESPONSÁVEL PELO CADASTRAMENTO DA DEMANDA': {
    prop: 'personContact',
    type: String,
    parse: emptyParserFunc(),
  },
  CEP: {
    prop: 'zipCode',
    type: String,
    parse: emptyParserFunc(),
  },
  ENDEREÇO: {
    prop: 'address',
    type: String,
    parse: emptyParserFunc(value => {
      if (value) {
        if (value.endsWith(',')) {
          value = value.substring(0, value.length - 1);
        }
        if (value.includes(', Porto Alegre - RS')) {
          value = value.replace(/, Porto Alegre - RS/g, '');
        }
        if (value.includes('- Porto Alegre - RS')) {
          value = value.replace(/- Porto Alegre - RS/g, '');
        }
        if (value.includes('-Porto Alegre-RS')) {
          value = value.replace(/-Porto Alegre-RS/g, '');
        }
        if (value.includes('- Porto Alegre-RS')) {
          value = value.replace(/- Porto Alegre-RS/g, '');
        }
        if (value.includes('- Porto Alegre/RS')) {
          value = value.replace(/- Porto Alegre\/RS/g, '');
        }
        value = value.trim();
      }
      return value;
    }),
  },
  TELEFONE: {
    prop: 'phone',
    type: String,
    parse: emptyParserFunc(),
  },
};

console.log(`Attempting to extract data from: ${inputFile}`);
const excelData = xlsxFile(inputFile, {
  schema,
})
  .then(({ rows, errors }) => {
    if (errors.length > 0) {
      console.log(errors);
    }
    rows = rows.map(item => {
      // city on name
      if (item.name.endsWith(` - ${item.city}`)) {
        item.name = item.name.substring(
          0,
          item.name.length - (item.city.length + 3)
        );
      }
      item.name = item.name.trim();
      // city on request manager
      if (item.requestManager) {
        if (item.requestManager.endsWith(` - ${item.city}`)) {
          item.requestManager = item.requestManager.substring(
            0,
            item.requestManager.length - (item.city.length + 3)
          );
        }
        item.requestManager = item.requestManager.trim();
        if (item.requestManager == item.name) {
          item.requestManager = null;
        }
      }
      // address
      if (item.address) {
        let address = item.address;
        if (address.includes('-')) {
          const splited = address.split('-');
          item.addressNeighborhood = splited[splited.length - 1].trim();
          delete splited[splited.length - 1];
          address = splited.join(' ');
        }
        if (address.includes('-')) {
          const splited = address.split('-');
          item.addressExtra = splited[splited.length - 1].trim();
          delete splited[splited.length - 1];
          address = splited.join(' ');
        }
        if (address.includes(',')) {
          const splited = address.split(',');
          item.addressStreet = splited[0].trim();
          let nbr = splited[splited.length - 1].trim().toLowerCase();
          if (nbr.toLowerCase().includes('bairro')) {
            nbr = nbr.replace('bairro').trim();
          }
          if (!isNaN(nbr)) {
            item.addressNumber = nbr;
          }
          delete splited[splited.length - 1];
          address = splited.join(' ').trim();
        }
      }
      // return
      return item;
    });
    return rows.filter(item => item.address);
  })
  .then(writeToJSONFile);

function writeToJSONFile(data) {
  console.log(`Saving extracted date to: ${outputFile}`);
  return fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
}
