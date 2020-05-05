const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

// type
const TYPE_REQUEST = 1;
const TYPE_DELIVERY = 2;
const TYPE_SUPPLY_RESERVE = 3;
const TYPE_SUPPLY_TRANSPORT = 4;
const TYPE_MANUAL_ADJUST = 9;

exports.TYPE_REQUEST = TYPE_REQUEST;
exports.TYPE_DELIVERY = TYPE_DELIVERY;
exports.TYPE_SUPPLY_RESERVE = TYPE_SUPPLY_RESERVE;
exports.TYPE_SUPPLY_TRANSPORT = TYPE_SUPPLY_TRANSPORT;
exports.TYPE_MANUAL_ADJUST = TYPE_MANUAL_ADJUST;
exports.TYPE_ALL = [
  TYPE_REQUEST,
  TYPE_DELIVERY,
  TYPE_SUPPLY_RESERVE,
  TYPE_SUPPLY_TRANSPORT,
  TYPE_MANUAL_ADJUST,
];

const typeToString = value => {
  switch (parseInt(value)) {
    case TYPE_REQUEST:
      return 'Solicitação';

    case TYPE_DELIVERY:
      return 'Entrega';

    case TYPE_SUPPLY_RESERVE:
      return 'Aguardando suprimento';

    case TYPE_SUPPLY_TRANSPORT:
      return 'Em transporte';

    case TYPE_MANUAL_ADJUST:
      return 'Ajuste manual';
  }
  return 'Desconhecido';
};
exports.typeToString = typeToString;

// status
const STATUS_NEW = 1;
const STATUS_REVIEW_REJECTED = 2;
const STATUS_REVIEW_OK = 3;
const STATUS_PROCESSED = 5;
const STATUS_CANCELED = 9;

exports.STATUS_NEW = STATUS_NEW;
exports.STATUS_REVIEW_REJECTED = STATUS_REVIEW_REJECTED;
exports.STATUS_REVIEW_OK = STATUS_REVIEW_OK;
exports.STATUS_PROCESSED = STATUS_PROCESSED;
exports.STATUS_CANCELED = STATUS_CANCELED;
exports.STATUS_ALL = [
  STATUS_NEW,
  STATUS_REVIEW_REJECTED,
  STATUS_REVIEW_OK,
  STATUS_PROCESSED,
  STATUS_CANCELED,
];

const statusToString = value => {
  switch (parseInt(value)) {
    case STATUS_NEW:
      return 'Novo';

    case STATUS_REVIEW_REJECTED:
      return 'Rejeitado';

    case STATUS_REVIEW_OK:
      return 'Revisão OK';

    case STATUS_PROCESSED:
      return 'Processado';

    case STATUS_CANCELED:
      return 'Cancelado';
  }
  return 'Desconhecido';
};
exports.statusToString = statusToString;

const {
  model: GL_UserModel,
  jsonSerializer: gl_userJsonSerializer,
} = require('./gl_user');
const {
  model: GL_PersonModel,
  jsonSerializer: gl_personJsonSerializer,
} = require('./gl_person');
const {
  model: GL_PersonContactModel,
  jsonSerializer: gl_personContactJsonSerializer,
} = require('./gl_person_contact');

// model
const modelName = 'or_order';
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
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    type: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    typeDesc: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ['type']),
      get: function () {
        return typeToString(this.get('type'));
      },
    },
    notes: {
      type: Sequelize.TEXT('medium'),
    },
    internalNotes: {
      type: Sequelize.TEXT('medium'),
    },
    needsReview: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    statusDesc: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ['status']),
      get: function () {
        return statusToString(this.get('status'));
      },
    },
    expiresIn: {
      type: Sequelize.DATE,
    },
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
);

// relations
GL_UserModel.hasMany(MyModel, {
  foreignKey: 'glUserId',
  as: 'orOrders',
});
MyModel.belongsTo(GL_UserModel, {
  foreignKey: 'glUserId',
  as: 'glUser',
});

GL_PersonModel.hasMany(MyModel, {
  foreignKey: 'glPersonOriginId',
  as: 'orOrdersOrigin',
});
MyModel.belongsTo(GL_PersonModel, {
  foreignKey: 'glPersonOriginId',
  as: 'glPersonOrigin',
});

GL_PersonContactModel.hasMany(MyModel, {
  foreignKey: 'glPersonContactOriginId',
  as: 'orOrdersOrigin',
});
MyModel.belongsTo(GL_PersonContactModel, {
  foreignKey: 'glPersonContactOriginId',
  as: 'glPersonContactOrigin',
});

GL_PersonModel.hasMany(MyModel, {
  foreignKey: 'glPersonDestinationId',
  as: 'orOrdersDestination',
});
MyModel.belongsTo(GL_PersonModel, {
  foreignKey: 'glPersonDestinationId',
  as: 'glPersonDestination',
});

GL_PersonContactModel.hasMany(MyModel, {
  foreignKey: 'glPersonContactDestinationId',
  as: 'orOrdersDestination',
});
MyModel.belongsTo(GL_PersonContactModel, {
  foreignKey: 'glPersonContactDestinationId',
  as: 'glPersonContactDestination',
});

// scopes
const scopes = {
  def: {
    include: ['id'],
  },
  admin: {
    glUuser: async (value, scopeName) =>
      await gl_userJsonSerializer(value, scopeName),
    glPersonOrigin: async (value, scopeName) =>
      await gl_personJsonSerializer(value, scopeName),
    glPersonContactOrigin: async (value, scopeName) =>
      await gl_personContactJsonSerializer(value, scopeName),
    glPersonDestination: async (value, scopeName) =>
      await gl_personJsonSerializer(value, scopeName),
    glPersonContactDestination: async (value, scopeName) =>
      await gl_personContactJsonSerializer(value, scopeName),
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
