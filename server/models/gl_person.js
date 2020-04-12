const nconf = require('nconf');
const { mainDb } = require('../database/main_connection');
const { BaseModel } = require('./base_model');
const { Sequelize, DataTypes } = require('sequelize');

const { model: CityModel } = require('./gl_city');

// legalType
const LEGAL_TYPE_PERSON = 1;
const LEGAL_TYPE_JURIDICAL = 2;
const LEGAL_TYPE_GROUP = 3;

exports.LEGAL_TYPE_PERSON = LEGAL_TYPE_PERSON;
exports.LEGAL_TYPE_JURIDICAL = LEGAL_TYPE_JURIDICAL;
exports.LEGAL_TYPE_GROUP = LEGAL_TYPE_GROUP;
exports.LEGAL_TYPE_ALL = [
  LEGAL_TYPE_PERSON,
  LEGAL_TYPE_JURIDICAL,
  LEGAL_TYPE_GROUP,
];

const legalTypeToString = (value) => {
  switch (parseInt(value)) {
    case LEGAL_TYPE_PERSON:
      return 'Pessoa física';

    case LEGAL_TYPE_JURIDICAL:
      return 'Pessoa jurídica';

    case LEGAL_TYPE_GROUP:
      return 'Grupo organizado';
  }
  return 'Desconhecido';
}
exports.legalTypeToString = legalTypeToString;


// legalIdentifierType
const LEGAL_IDENTIFIER_TYPE_BR_CPF = 'CPF';
const LEGAL_IDENTIFIER_TYPE_BR_CNPJ = 'CNPJ';
const LEGAL_IDENTIFIER_TYPE_BR_OTHER = 'OTHER';

exports.LEGAL_IDENTIFIER_TYPE_BR_CPF = LEGAL_IDENTIFIER_TYPE_BR_CPF;
exports.LEGAL_IDENTIFIER_TYPE_BR_CNPJ = LEGAL_IDENTIFIER_TYPE_BR_CNPJ;
exports.LEGAL_IDENTIFIER_TYPE_BR_OTHER = LEGAL_IDENTIFIER_TYPE_BR_OTHER;
exports.LEGAL_IDENTIFIER_TYPE_ALL = [
  LEGAL_IDENTIFIER_TYPE_BR_CPF,
  LEGAL_IDENTIFIER_TYPE_BR_CNPJ,
  LEGAL_IDENTIFIER_TYPE_BR_OTHER,
];

// model
const modelName = 'gl_person';
class MyModel extends BaseModel { }

MyModel.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  createdAt: {
    allowNull: true,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: true,
    type: Sequelize.DATE,
  },
  legalType: Sequelize.INTEGER,
  legalTypeDesc: {
    type: new DataTypes.VIRTUAL(DataTypes.STRING, ['legalType']),
    get: function () {
      return legalTypeToString(this.get('legalType'));
    }
  },
  legalIdentifierType: Sequelize.STRING(60),
  legalIdentifierCode: Sequelize.STRING(60),
  name: {
    type: Sequelize.STRING(90),
    allowNull: false,
    validate: {
      notEmpty: false,
      len: {
        args: [1, 90],
        msg: 'Nome deve ter de 1 a 90 caracteres.',
      }
    }
  },
  shortname: Sequelize.STRING(90),
  phone: Sequelize.STRING(60),
  cellphone: Sequelize.STRING(60),
  email: Sequelize.STRING(60),
  address: Sequelize.STRING(60),
  addressZipcode: Sequelize.STRING(60),
  addressNumber: Sequelize.STRING(60),
  addressExtra: Sequelize.STRING(60),
  addressNeighborhood: Sequelize.STRING(60),
  birthdate: Sequelize.DATE,
  trusted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  latitude: {
    type: Sequelize.DECIMAL(10, 7),
    defaultValue: 0,
  },
  longitude: {
    type: Sequelize.DECIMAL(10, 7),
    defaultValue: 0,
  },
  obs: Sequelize.TEXT('medium'),
}, {
  // options
  sequelize: mainDb,
  modelName: modelName,
  tableName: modelName,
});

CityModel.hasMany(MyModel, {
  foreignKey: 'cityId',
  as: 'persons'
});
MyModel.belongsTo(CityModel, {
  foreignKey: 'cityId',
  as: 'city',
});

exports.model = MyModel;
exports.modelName = modelName;
