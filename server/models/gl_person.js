const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

const {
  model: CityModel,
  jsonSerializer: cityJsonSerializer,
} = require('./gl_city');
const {
  model: PersonTypeModel,
  jsonSerializer: personTypeSerializer,
} = require('./gl_person_type');

// legalType
const LEGAL_TYPE_PERSON = 1;
const LEGAL_TYPE_JURIDICAL_PRIVATE = 2;
const LEGAL_TYPE_JURIDICAL_PUBLIC = 3;
const LEGAL_TYPE_CIVIL_ORGANIZATION = 4;
const LEGAL_TYPE_SUB_ENTITY = 5;
const LEGAL_TYPE_FAST_CRUD = 6;

exports.LEGAL_TYPE_PERSON = LEGAL_TYPE_PERSON;
exports.LEGAL_TYPE_JURIDICAL_PRIVATE = LEGAL_TYPE_JURIDICAL_PRIVATE;
exports.LEGAL_TYPE_JURIDICAL_PUBLIC = LEGAL_TYPE_JURIDICAL_PUBLIC;
exports.LEGAL_TYPE_CIVIL_ORGANIZATION = LEGAL_TYPE_CIVIL_ORGANIZATION;
exports.LEGAL_TYPE_SUB_ENTITY = LEGAL_TYPE_SUB_ENTITY;
exports.LEGAL_TYPE_FAST_CRUD = LEGAL_TYPE_FAST_CRUD;
exports.LEGAL_TYPE_ALL = [
  LEGAL_TYPE_PERSON,
  LEGAL_TYPE_JURIDICAL_PRIVATE,
  LEGAL_TYPE_JURIDICAL_PUBLIC,
  LEGAL_TYPE_CIVIL_ORGANIZATION,
  LEGAL_TYPE_SUB_ENTITY,
  LEGAL_TYPE_FAST_CRUD,
];

const legalTypeToString = value => {
  switch (parseInt(value)) {
    case LEGAL_TYPE_PERSON:
      return 'Pessoa Física';

    case LEGAL_TYPE_JURIDICAL_PRIVATE:
      return 'Pessoa Jurídica de direito PRIVADO';

    case LEGAL_TYPE_JURIDICAL_PUBLIC:
      return 'Pessoa Jurídica de direito PÚBLICO';

    case LEGAL_TYPE_CIVIL_ORGANIZATION:
      return 'Organização Civil';

    case LEGAL_TYPE_SUB_ENTITY:
      return 'Setor ou Subentidade (sem CNPJ)';

    case LEGAL_TYPE_FAST_CRUD:
      return 'Cadastro rápido';
  }
  return 'Desconhecido';
};
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
class MyModel extends BaseModel {}

MyModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
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
      },
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
        },
      },
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
    priority: Sequelize.INTEGER,
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
);

CityModel.hasMany(MyModel, {
  foreignKey: 'cityId',
  as: 'persons',
});
MyModel.belongsTo(CityModel, {
  foreignKey: 'cityId',
  as: 'city',
});
MyModel.belongsTo(MyModel, {
  foreignKey: 'personParentId',
  as: 'personParent',
});
MyModel.belongsTo(PersonTypeModel, {
  foreignKey: 'personTypeId',
  as: 'personType',
});

const scopes = {
  def: {
    include: [
      'id',
      'name',
      'shortname',
      'email',
      'legalType',
      'legalTypeDesc',
      'legalIdentifierType',
      'legalIdentifierCode',
    ],
  },
  account: {
    include: [
      'id',
      'name',
      'shortname',
      'email',
      'legalType',
      'legalTypeDesc',
      'legalIdentifierType',
      'legalIdentifierCode',
      'cityId',
      'city',
      'personTypeId',
      'personType',
      'priority',
    ],
    maps: {
      city: async (value, scopeName) =>
        await cityJsonSerializer(value, scopeName),
      personType: async (value, scopeName) =>
        await personTypeSerializer(value, scopeName),
    },
  },
  admin: {
    maps: {
      city: async (value, scopeName) =>
        await cityJsonSerializer(value, scopeName),
      personParent: async (value, scopeName) =>
        await exports.jsonSerializer(value, scopeName),
      personType: async (value, scopeName) =>
        await personTypeSerializer(value, scopeName),
    },
  },
};

exports.model = MyModel;
exports.modelName = modelName;
exports.jsonSerializer = async (value, scopeName) => {
  if (!scopeName) {
    scopeName = 'def';
  }
  if (!scopes[scopeName]) {
    scopeName = 'def';
  }
  return await jsonSerializer(value, scopes[scopeName], scopeName);
};
