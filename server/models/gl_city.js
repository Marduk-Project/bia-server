const nconf = require('nconf')
const { Sequelize, DataTypes } = require('sequelize')

const { mainDb } = require('../database/main_connection')
const { BaseModel, jsonSerializer } = require('./base_model')
const {
  model: StateModel,
  jsonSerializer: stateJsonSerializer,
} = require('./gl_state')
const StateRegionModelModule = require('./gl_state_region')

// model
const modelName = 'gl_city'
class MyModel extends BaseModel {
  static async findByCode(code) {
    return await this.findOne({
      where: {
        code: code,
      },
    })
  }

  /**
   * Add and save a region by its id
   * @param {int} regionId
   * @param {string} type
   * @return {Promise<CityStateRegion>}
   */
  async setStateRegion(regionId, type) {
    const CityStateRegionModelModule = require('./gl_city_state_region')
    let entity = await CityStateRegionModelModule.model.findByCityAndType(
      this.id,
      type
    )
    // check region
    if (!regionId) {
      if (entity) {
        // delete if set to no region
        await entity.destroy()
      }
    } else {
      // create relation
      if (!entity) {
        entity = CityStateRegionModelModule.model.build()
      }
      entity.cityId = this.id
      entity.type = type
      entity.stateRegionId = regionId
      await entity.save()
    }
    return entity
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
        notEmpty: false,
        len: {
          args: [1, 60],
          msg: 'Nome deve ter de 1 a 60 caracteres.',
        },
      },
    },
    code: {
      type: Sequelize.STRING,
    },
    initials: {
      type: Sequelize.STRING,
    },
    priority: {
      type: Sequelize.INTEGER,
    },
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
)

StateModel.hasMany(MyModel, {
  foreignKey: 'stateId',
  as: 'cities',
})
MyModel.belongsTo(StateModel, {
  foreignKey: 'stateId',
  as: 'state',
})

const regionSerializer = type => {
  return async (value, scopeName, parent) => {
    const CityStateRegionModelModule = require('./gl_city_state_region')
    const entity = await CityStateRegionModelModule.model.findByCityAndType(
      parent.id,
      type
    )
    return await StateRegionModelModule.jsonSerializer(
      entity ? entity.stateRegion : null
    )
  }
}

const scopes = {
  def: {
    include: ['id', 'name', 'code'],
  },
  admin: {
    maps: {
      state: async (value, scopeName) =>
        await stateJsonSerializer(value, scopeName),
    },
  },
  admin_edit: {
    maps: {
      state: async (value, scopeName) =>
        await stateJsonSerializer(value, scopeName),
      mesoRegion: regionSerializer(StateRegionModelModule.TYPE_MESO),
      microRegion: regionSerializer(StateRegionModelModule.TYPE_MICRO),
      dreRegion: regionSerializer(StateRegionModelModule.TYPE_DRE),
    },
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
