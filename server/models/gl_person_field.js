const nconf = require("nconf");
const { Sequelize, DataTypes } = require("sequelize");

const { mainDb } = require("../database/main_connection");
const { BaseModel, jsonSerializer } = require("./base_model");

const {
  model: FieldModel,
  jsonSerializer: fieldJsonSerializer,
  DESTINATION_GL_PERSON,
} = require("./gl_field");
const {
  model: FieldItemModel,
  jsonSerializer: fieldItemJsonSerializer,
} = require("./gl_field_item");
const {
  model: PersonModel,
  jsonSerializer: personJsonSerializer,
} = require("./gl_person");

// model
const modelName = "gl_person_field";
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
    valueString: {
      type: Sequelize.STRING,
    },
    valueInt: {
      type: Sequelize.INTEGER,
    },
    valueDouble: {
      type: Sequelize.DOUBLE,
    },
    valueBoolean: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    valueSearch: {
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
FieldModel.hasMany(MyModel, {
  foreignKey: "fieldId",
  as: "personFields",
});
MyModel.belongsTo(FieldModel, {
  foreignKey: "fieldId",
  as: "field",
});
FieldItemModel.hasMany(MyModel, {
  foreignKey: "fieldItemId",
  as: "personFields",
});
MyModel.belongsTo(FieldItemModel, {
  foreignKey: "fieldItemId",
  as: "fieldItem",
});
PersonModel.hasMany(MyModel, {
  foreignKey: "personId",
  as: "fields",
});
MyModel.belongsTo(PersonModel, {
  foreignKey: "personId",
  as: "person",
});

// scopes
const scopes = {
  def: {
    include: ["id"],
  },
  admin: {
    field: async (value, scopeName) =>
      await fieldJsonSerializer(value, scopeName),
    fieldItem: async (value, scopeName) =>
      await fieldItemJsonSerializer(value, scopeName),
    person: async (value, scopeName) =>
      await personJsonSerializer(value, scopeName),
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

/**
 * Find or create the fields for this person
 * @param {Number} personId
 */
exports.findAllOrCreateByPerson = async (personId) => {
  const fieldList = await FieldModel.findAll({
    where: {
      destination: DESTINATION_GL_PERSON,
    },
    order: [
      ["order", "asc"],
      ["name", "asc"],
    ],
  });
  let list = [];
  await Promise.all(
    fieldList.map(async (field) => {
      const load = async () => {
        return await MyModel.findOne({
          where: {
            personId: personId,
            fieldId: field.id,
          },
          include: ["field", "fieldItem"],
        });
      };
      let entity = await load();
      if (!entity) {
        entity = MyModel.build({
          personId: personId,
          fieldId: field.id,
        });
        await entity.save();
        entity = await load();
      }
      list.push(entity);
    })
  );
  // need to sort, promisse is async
  list = list.sort((a, b) => {
    if (a.field.order == b.field.order) {
      if (a.field.name < b.field.name) {
        return -1;
      }
      return 1;
    }
    // todo tratar acentos
    return a.field.order - b.field.order;
  });
  return list;
};
