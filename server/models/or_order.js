const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

const common = require('../../common/models/or_order');

const { typeToString, statusToString } = common;
exports.common = common;

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
    maps: {
      glUser: async (value, scopeName) =>
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
  },
  account: {
    include: [
      'id',
      'createdAt',
      'updatedAt',
      'status',
      'statusDesc',
      'type',
      'typeDesc',
      'notes',
      'glUserId',
      'glUser',
      'glPersonOriginId',
      'glPersonOrigin',
      'glPersonContactOriginId',
      'glPersonContactOrigin',
      'glPersonDestinationId',
      'glPersonDestination',
      'glPersonContactDestinationId',
      'glPersonContactDestination',
      'glProducts',
    ],
    maps: {
      glUser: async (value, scopeName) =>
        await gl_userJsonSerializer(value, scopeName),
      glPersonOrigin: async (value, scopeName) =>
        await gl_personJsonSerializer(value, scopeName),
      glPersonContactOrigin: async (value, scopeName) =>
        await gl_personContactJsonSerializer(value, scopeName),
      glPersonDestination: async (value, scopeName) =>
        await gl_personJsonSerializer(value, scopeName),
      glPersonContactDestination: async (value, scopeName) => {
        return await gl_personContactJsonSerializer(value, scopeName);
      },
      glProducts: async (value, scopeName) => {
        const { jsonSerializer } = require('./or_order_product');
        return await jsonSerializer(value, scopeName);
      },
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

require('./or_order_consolidated');
