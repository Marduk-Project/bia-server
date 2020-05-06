const nconf = require('nconf');
const { Sequelize, DataTypes } = require('sequelize');

const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');

const {
  model: StateRegionModel,
  jsonSerializer: stateRegionJsonSerializer,
} = require('./gl_state_region');
const {
  model: CityModel,
  jsonSerializer: cityJsonSerializer,
} = require('./gl_city');

// model
const modelName = 'gl_city_state_region';
class MyModel extends BaseModel {
  /**
   * @param {int} cityId
   * @param {string} type
   * @returns {Promise<MyModel>|null}
   */
  static async findByCityAndType(cityId, type) {
    return await this.findOne({
      where: {
        cityId: cityId,
        type: type,
      },
      include: ['stateRegion'],
    });
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
    type: {
      type: Sequelize.STRING,
      allowNull: false,
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
StateRegionModel.hasMany(MyModel, {
  foreignKey: 'stateRegionId',
  as: 'cities',
});
MyModel.belongsTo(StateRegionModel, {
  foreignKey: 'stateRegionId',
  as: 'stateRegion',
});
CityModel.hasMany(MyModel, {
  foreignKey: 'cityId',
  as: 'regions',
});
MyModel.belongsTo(CityModel, {
  foreignKey: 'cityId',
  as: 'city',
});

// scopes
const scopes = {
  def: {
    include: ['id', 'name', 'code'],
  },
  admin: {
    maps: {
      stateRegion: async (value, scopeName) =>
        await stateRegionJsonSerializer(value, scopeName),
      city: async (value, scopeName) =>
        await cityJsonSerializer(value, scopeName),
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
