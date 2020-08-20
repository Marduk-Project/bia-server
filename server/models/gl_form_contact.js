const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

const {
  model: UserModel,
  jsonSerializer: userJsonSerializer,
} = require('./gl_user');

const common = require('../../common/models/gl_form_contact');

const { typeToString } = common;
exports.common = common;

// model
const modelName = 'gl_form_contact';
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
      type: Sequelize.STRING,
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
    personName: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 90],
          msg: 'Nome deve ter de 1 a 90 caracteres.',
        },
      },
    },
    personEmail: {
      type: Sequelize.STRING,
    },
    personPhone: {
      type: Sequelize.STRING,
    },
    subject: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 90],
          msg: 'Nome deve ter de 1 a 90 caracteres.',
        },
      },
    },
    message: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: true,
      },
    },
    response: {
      type: Sequelize.TEXT,
    },
    responseDateTime: {
      type: Sequelize.DATE,
    },
    internalNotes: {
      type: Sequelize.TEXT,
    },
    needsReview: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    remoteIp: {
      type: Sequelize.STRING,
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

// userCreatedId
UserModel.hasMany(MyModel, {
  foreignKey: 'userCreatedId',
  as: 'formContactsCreated',
});
MyModel.belongsTo(UserModel, {
  foreignKey: 'userCreatedId',
  as: 'userCreated',
});

// userResponseId
UserModel.hasMany(MyModel, {
  foreignKey: 'userResponseId',
  as: 'formContactsResponses',
});
MyModel.belongsTo(UserModel, {
  foreignKey: 'userResponseId',
  as: 'userResponse',
});
// scopes
const scopes = {
  def: {
    include: ['id'],
  },
  admin: {
    maps: {
      userCreated: async (value, scopeName) =>
        await userJsonSerializer(value, scopeName),
      userResponse: async (value, scopeName) =>
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
