const nconf = require('nconf')
const { Sequelize, DataTypes } = require('sequelize')

const { mainDb } = require('../database/main_connection')
const { BaseModel, jsonSerializer } = require('./base_model')

const {
  model: StateModel,
  jsonSerializer: stateJsonSerializer,
} = require('./gl_state')

// type
const TYPE_MESO = 'meso'
const TYPE_MICRO = 'micro'
const TYPE_DRE = 'dre'

exports.TYPE_MESO = TYPE_MESO
exports.TYPE_MICRO = TYPE_MICRO
exports.TYPE_DRE = TYPE_DRE
exports.TYPE_ALL = [TYPE_MESO, TYPE_MICRO, TYPE_DRE]

const typeToString = value => {
  switch (value) {
    case TYPE_MESO:
      return 'Mesorregião'

    case TYPE_MICRO:
      return 'Microrregião'

    case TYPE_DRE:
      return 'Região DRE'
  }
  return 'Desconhecido'
}
exports.typeToString = typeToString

// model
const modelName = 'gl_state_region'
class MyModel extends BaseModel {
  static async findByIdAndTypeAndStateId(id, type, stateId) {
    return await this.findOne({
      where: {
        id: id,
        type: type,
      },
    })
  }

  static async existsByIdAndTypeStateId(id, type, stateId) {
    return (
      (await this.count({
        where: {
          id: id,
          type: type,
        },
      })) > 0
    )
  }
}

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
    name: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 60],
          msg: 'Nome deve ter de 1 a 60 caracteres.',
        },
      },
    },
    code: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 60],
          msg: 'Nome deve ter de 1 a 60 caracteres.',
        },
      },
    },
    type: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 60],
          msg: 'Nome deve ter de 1 a 60 caracteres.',
        },
      },
    },
    typeDesc: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ['type']),
      get: function () {
        return typeToString(this.get('type'))
      },
    },
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
)

// relations
StateModel.hasMany(MyModel, {
  foreignKey: 'stateId',
  as: 'regions',
})
MyModel.belongsTo(StateModel, {
  foreignKey: 'stateId',
  as: 'state',
})

// scopes
const scopes = {
  def: {
    include: ['id', 'name', 'code', 'type', 'typeDesc'],
  },
  admin: {
    state: async (value, scopeName) =>
      await stateJsonSerializer(value, scopeName),
  },
}

exports.model = MyModel
exports.modelName = modelName
exports.jsonSerializer = async (value, scopeName) => {
  if (!scopeName) {
    scopeName = 'def'
  }
  if (!scopes[scopeName]) {
    scopeName = 'def'
  }
  return await jsonSerializer(value, scopes[scopeName], scopeName)
}
