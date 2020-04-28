const nconf = require("nconf");
const { Sequelize, DataTypes } = require("sequelize");

const { mainDb } = require("../database/main_connection");
const { BaseModel, jsonSerializer } = require("./base_model");
const {
  model: StateModel,
  jsonSerializer: stateJsonSerializer,
} = require("./gl_state");

// model
const modelName = "gl_city";
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
    name: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: false,
        len: {
          args: [1, 60],
          msg: "Nome deve ter de 1 a 60 caracteres.",
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
);

StateModel.hasMany(MyModel, {
  foreignKey: "stateId",
  as: "cities",
});
MyModel.belongsTo(StateModel, {
  foreignKey: "stateId",
  as: "state",
});

const scopes = {
  def: {
    include: ["id", "name", "code"],
  },
  admin: {
    maps: {
      state: async (value, scopeName) =>
        await stateJsonSerializer(value, scopeName),
    },
  },
};

exports.model = MyModel;
exports.modelName = modelName;
exports.jsonSerializer = async (value, scopeName) => {
  if (!scopeName) {
    scopeName = "def";
  }
  if (!scopes[scopeName]) {
    scopeName = "def";
  }
  return await jsonSerializer(value, scopes[scopeName], scopeName);
};
