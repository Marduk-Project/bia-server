const nconf = require("nconf");
const { Sequelize, DataTypes } = require("sequelize");

const { mainDb } = require("../database/main_connection");
const { BaseModel, jsonSerializer } = require("./base_model");

// level
const TYPE_STRING = 1;
const TYPE_INT = 2;
const TYPE_DOUBLE = 3;
const TYPE_BOOLEAN = 4;
const TYPE_SELECT = 5;

exports.TYPE_STRING = TYPE_STRING;
exports.TYPE_INT = TYPE_INT;
exports.TYPE_DOUBLE = TYPE_DOUBLE;
exports.TYPE_BOOLEAN = TYPE_BOOLEAN;
exports.TYPE_SELECT = TYPE_SELECT;
exports.TYPE_ALL = [
  TYPE_STRING,
  TYPE_INT,
  TYPE_DOUBLE,
  TYPE_BOOLEAN,
  TYPE_SELECT,
];

const DESTINATION_GL_PERSON = "gl_person";
exports.DESTINATION_GL_PERSON = DESTINATION_GL_PERSON;
exports.DESTINATION_ALL = [DESTINATION_GL_PERSON];

const typeToString = (value) => {
  switch (parseInt(value)) {
    case TYPE_STRING:
      return "Texto (String)";

    case TYPE_INT:
      return "Inteiro (Int)";

    case TYPE_DOUBLE:
      return "Número com virgula (Double)";

    case TYPE_BOOLEAN:
      return "Checkbox (Boolean)";

    case TYPE_SELECT:
      return "Com itens (Select)";
  }
  return "Desconhecido";
};
exports.typeToString = typeToString;

// model
const modelName = "gl_field";
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
    destination: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 60],
          msg: "Nome deve ter de 1 a 60 caracteres.",
        },
      },
    },
    code: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    typeDesc: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ["type"]),
      get: function () {
        return typeToString(this.get("type"));
      },
    },
    order: {
      type: Sequelize.INTEGER,
    },
    defaultValue: {
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

// scopes
const scopes = {
  def: {
    include: [
      "id",
      "destination",
      "name",
      "code",
      "type",
      "typeDesc",
      "order",
      "defaultValue",
    ],
  },
  admin: {}, // all
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
