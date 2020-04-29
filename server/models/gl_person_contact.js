const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

const {
  model: PersonModel,
  jsonSerializer: personJsonSerializer,
} = require('./gl_person');
const {
  model: UserModel,
  jsonSerializer: userJsonSerializer,
} = require('./gl_user');

// legalType
const LEVEL_ADMIN = 1;
const LEVEL_STAFF = 5;
const LEVEL_NORMAL = 10;

exports.LEVEL_ADMIN = LEVEL_ADMIN;
exports.LEVEL_STAFF = LEVEL_STAFF;
exports.LEVEL_NORMAL = LEVEL_NORMAL;
exports.LEVEL_ALL = [LEVEL_ADMIN, LEVEL_STAFF, LEVEL_NORMAL];

const levelToString = value => {
  switch (parseInt(value)) {
    case LEVEL_ADMIN:
      return 'Administrador';

    case LEVEL_STAFF:
      return 'Gestão';

    case LEVEL_NORMAL:
      return 'Normal';
  }
  return 'Desconhecido';
};
exports.levelToString = levelToString;

// model
const modelName = 'gl_person_contact';
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
    name: Sequelize.STRING(90),
    phone: Sequelize.STRING(60),
    cellphone: Sequelize.STRING(60),
    email: Sequelize.STRING(60),
    trusted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    obs: Sequelize.TEXT('medium'),
    level: Sequelize.INTEGER,
    levelDesc: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ['level']),
      get: function () {
        return levelToString(this.get('level'));
      },
    },
    canRegisterPPERequest: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
);

PersonModel.hasMany(MyModel, {
  foreignKey: 'personId',
  as: 'contacts',
});
MyModel.belongsTo(PersonModel, {
  foreignKey: 'personId',
  as: 'person',
});

PersonModel.hasMany(MyModel, {
  foreignKey: 'personReferenceId',
  as: 'contactReferences',
});
MyModel.belongsTo(PersonModel, {
  foreignKey: 'personReferenceId',
  as: 'personReference',
});

UserModel.hasMany(MyModel, {
  foreignKey: 'userId',
  as: 'personContacts',
});
MyModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
});

const scopes = {
  def: {
    include: ['id', 'name', 'shortname', 'email', 'level', 'levelDesc'],
  },
  admin: {
    maps: {
      person: async (value, scopeName) =>
        await personJsonSerializer(value, scopeName),
      personReference: async (value, scopeName) =>
        await personJsonSerializer(value, scopeName),
      user: async (value, scopeName) =>
        await userJsonSerializer(value, scopeName),
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
