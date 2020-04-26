const nconf = require("nconf");
const { Sequelize, DataTypes } = require("sequelize");

const { mainDb } = require("../database/main_connection");
const { BaseModel, jsonSerializer } = require("./base_model");

const {
  model: UnityModel,
  jsonSerializer: unityJsonSerializer,
} = require("./gl_unity");

// model
const modelName = "gl_product";
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
        notEmpty: true,
        len: {
          args: [1, 60],
          msg: "Nome deve ter de 1 a 60 caracteres.",
        },
      },
    },
    description: {
      type: Sequelize.STRING,
    },
    eanCode: {
      type: Sequelize.STRING,
    },
    healthCode: {
      type: Sequelize.STRING,
    },
    requestFormActive: {
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

// relations
UnityModel.hasMany(MyModel, {
  foreignKey: "unityId",
  as: "products",
});
MyModel.belongsTo(UnityModel, {
  foreignKey: "unityId",
  as: "unity",
});

// scopes
const scopes = {
  def: {
    include: ["id", "name"], // TODO scopes
  },
  admin: {
    unity: async (value, scopeName) =>
      await unityJsonSerializer(value, scopeName),
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
