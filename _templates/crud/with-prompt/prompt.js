const camelCase = require("camelcase");
const moment = require("moment");

const inTestMode = false;

/**
 * Convert
 * @param {string} modelName
 * @param {string} myName
 * @param {object} options
 * @param {boolean} options.upperStart
 * @param {boolean} options.clearIdSuffix
 * @param {boolean} options.forcedUpperPreffix
 */
const toCamelCaseName = (modelName, myName, options) => {
  if (!modelName) {
    return modelName;
  }
  if (!options) {
    options = {};
  }
  let match = myName.match(/^([a-zA-Z]{2})_/);
  const myPreffix = match ? match[1].toUpperCase() : undefined;
  match = modelName.match(/^([a-zA-Z]{2})_/);
  const modelPreffix = match ? match[1].toUpperCase() : undefined;
  modelName = modelName.replace(/^[a-zA-Z]{2}_/, "");
  modelName = camelCase(modelName);
  if (options.clearIdSuffix) {
    modelName = modelName.replace(/Id$/, "");
  }
  if (options.upperStart) {
    modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  }
  if ((myPreffix && modelPreffix) || options.forcedUpperPreffix) {
    if (myPreffix != modelPreffix || options.forcedUpperPreffix) {
      if (options.upperStart || options.forcedUpperPreffix) {
        modelName = `${modelPreffix}_${modelName}`;
      } else {
        modelName = `${modelPreffix.toLowerCase()}_${modelName}`;
      }
    }
  }
  return modelName;
};

module.exports = {
  prompt: ({ inquirer }) => {
    let questions = null;
    if (inTestMode) {
      questions = [
        {
          type: "confirm",
          name: "inTestMode",
          message: "Running in test mode, OK?",
          validate: (value) => {
            return value;
          },
          initial: "Y",
        },
      ];
    } else {
      questions = [
        {
          type: "input",
          name: "name",
          message: "Name of the crud table? (eg. gl_user)",
          validate: (value) => {
            return value.length > 0;
          },
        },
        {
          type: "select",
          name: "crud_context",
          message: "Select the context",
          choices: ["admin", "visitor"],
        },
        {
          type: "confirm",
          name: "crud_timestamps",
          message: "Include model table timestamps?",
          initial: "Y",
        },
        // TODO pensar
        // {
        //   type: 'select',
        //   name: 'crud_actions',
        //   message: 'What do you want to create?',
        //   choices: ['controller', 'model', 'vueEdit', 'vueList', 'sequelizeMigration', 'routes'],
        //   multiple: true,
        //   initial: ['controller', 'model', 'vueEdit', 'vueList', 'sequelizeMigration', 'routes'],
        //   validate(value, state, item, index) {
        //     return (value.length > 0);
        //   }
        // },
        {
          type: "input",
          name: "crud_parentName",
          message: "If exists, type the parent name model(eg. gl_person) ?",
        },
        {
          type: "list",
          name: "crud_fieldNames",
          message:
            'Type the field names? (separate by comma: "name, code, description, ...")',
          validate(value, state, item, index) {
            return value.length > 0;
          },
        },
      ];
    }
    return inquirer
      .prompt(questions)
      .then((answers) => {
        answers.nameWithHyphen = answers.name.replace(/_/g, "-");
        answers.nowPreffix = moment().format("YYYYMMDDHmmss");
        if (inTestMode) {
          return {
            nowPreffix: answers.nowPreffix,
            name: "gl_state",
            nameWithHyphen: "gl-state",
            fullModelCamelNameUpper: toCamelCaseName("gl_state", "gl_state", {
              upperStart: true,
              forcedUpperPreffix: true,
            }),
            modelCamelNameUpper: toCamelCaseName("gl_state", "gl_state", {
              upperStart: true,
            }),
            crud_context: "admin",
            crud_timestamps: true,
            crud_parentName: "gl_country",
            crud_parentModelName: "CountryModel",
            crud_parentCamelName: "Country",
            crud_parentFieldName: "countryId",
            crud_fieldNames: [
              "name",
              "code",
              "countryId",
              "personId",
              "intReq",
              "intNoReq",
              "boolReq",
              "boolNoReq",
              "doubleReq",
              "doubleNoReq",
              "datetimeReq",
              "datetimeNoReq",
            ],
            crud_fieldObjects: [
              {
                name: "name",
                type: "string",
                required: true,
                modelName: null,
              },
              {
                name: "code",
                type: "string",
                required: false,
                modelName: null,
              },
              {
                name: "intReq",
                type: "int",
                required: true,
                modelName: null,
              },
              {
                name: "intNoReq",
                type: "int",
                required: false,
                modelName: null,
              },
              {
                name: "boolReq",
                type: "boolean",
                required: true,
                modelName: null,
              },
              {
                name: "boolNoReq",
                type: "boolean",
                required: false,
                modelName: null,
              },
              {
                name: "doubleReq",
                type: "double",
                required: true,
                modelName: null,
              },
              {
                name: "doubleNoReq",
                type: "double",
                required: false,
                modelName: null,
              },
              {
                name: "datetimeReq",
                type: "datetime",
                required: true,
                modelName: null,
              },
              {
                name: "datetimeNoReq",
                type: "datetime",
                required: false,
                modelName: null,
              },
              {
                name: "countryId",
                type: "int",
                required: true,
                modelName: "gl_country",
                modelCamelName: `${toCamelCaseName("gl_country", "gl_state", {
                  upperStart: true,
                  clearIdSuffix: true,
                })}Model`,
                camelNameUpperNoId: toCamelCaseName("gl_country", "gl_state", {
                  upperStart: true,
                  clearIdSuffix: true,
                }),
                camelNameUpper: toCamelCaseName("gl_country", "gl_state", {
                  upperStart: true,
                }),
                camelName: toCamelCaseName("gl_country", "gl_state", {
                  upperStart: false,
                }),
                camelNameNoId: toCamelCaseName("gl_country", "gl_state", {
                  upperStart: false,
                  clearIdSuffix: true,
                }),
                isParentId: true,
              },
              {
                name: "personId",
                type: "int",
                required: false,
                modelName: "gl_person",
                modelCamelName: `${toCamelCaseName("gl_person", "gl_state", {
                  upperStart: true,
                  clearIdSuffix: true,
                })}Model`,
                camelNameUpperNoId: toCamelCaseName("gl_person", "gl_state", {
                  upperStart: true,
                  clearIdSuffix: true,
                }),
                camelNameUpper: toCamelCaseName("gl_person", "gl_state", {
                  upperStart: true,
                }),
                camelName: toCamelCaseName("gl_person", "gl_state", {
                  upperStart: false,
                }),
                camelNameNoId: toCamelCaseName("gl_person", "gl_state", {
                  upperStart: false,
                  clearIdSuffix: true,
                }),
                isParentId: false,
              },
            ],
          };
        } else {
          answers.fullModelCamelNameUpper = toCamelCaseName(
            answers.name,
            answers.name,
            { upperStart: true, forcedUpperPreffix: true }
          );
          answers.modelCamelNameUpper = toCamelCaseName(
            answers.name,
            answers.name,
            { upperStart: true }
          );
          const questions = [];
          // inject parent field if missing
          if (answers.crud_parentName) {
            const parentFieldName = `${toCamelCaseName(
              answers.crud_parentName,
              answers.name,
              { upperStart: false, clearIdSuffix: true }
            )}Id`;
            if (
              !answers.crud_fieldNames.find((item) => item == parentFieldName)
            ) {
              answers.crud_fieldNames.push(parentFieldName);
            }
          }
          answers.crud_fieldNames.forEach((field) => {
            questions.push({
              type: "select",
              name: field + ".type",
              message: `Type for "${field}"?`,
              choices: ["string", "boolean", "int", "double", "datetime"],
              initial:
                field.endsWith("id") || field.endsWith("Id") ? "int" : "string",
            });
            questions.push({
              type: "confirm",
              name: field + ".required",
              message: `"${field}" is required?`,
              initial: "n",
            });
            if (field.endsWith("id") || field.endsWith("Id")) {
              questions.push({
                type: "input",
                name: field + ".modelName",
                message: `If has, type "${field}" related model filename (eg. gl_other_model)?`,
              });
            }
          });
          // both set of answers must be returned as a merged object, else the previous set of answers won't be available to the templates
          return inquirer.prompt(questions).then((nextAnswers) => {
            answers.crud_fieldObjects = [];
            answers.crud_fieldNames.forEach((field) => {
              nextAnswers[field].name = field;
              if (nextAnswers[field].modelName) {
                nextAnswers[
                  field
                ].modelCamelName = `${toCamelCaseName(
                  nextAnswers[field].modelName,
                  answers.name,
                  { upperStart: true, clearIdSuffix: true }
                )}Model`;
                nextAnswers[
                  field
                ].camelNameUpperNoId = toCamelCaseName(
                  nextAnswers[field].modelName,
                  answers.name,
                  { upperStart: true, clearIdSuffix: true }
                );
                nextAnswers[field].camelNameUpper = toCamelCaseName(
                  nextAnswers[field].modelName,
                  answers.name,
                  { upperStart: true }
                );
                nextAnswers[field].camelName = toCamelCaseName(
                  nextAnswers[field].modelName,
                  answers.name,
                  { upperStart: false }
                );
                nextAnswers[field].camelNameNoId = toCamelCaseName(
                  nextAnswers[field].modelName,
                  answers.name,
                  { upperStart: false, clearIdSuffix: true }
                );
                nextAnswers[field].isParentId =
                  answers.crud_parentName &&
                  answers.crud_parentName == nextAnswers[field].modelName;
                // parent
                if (nextAnswers[field].isParentId) {
                  answers.crud_parentModelName =
                    nextAnswers[field].modelCamelName;
                  answers.crud_parentCamelName = nextAnswers[field].camelName;
                  answers.crud_parentFieldName = nextAnswers[field].name;
                } else {
                  answers.modelCamelName = null;
                  answers.crud_parentCamelName = null;
                  answers.crud_parentFieldName = null;
                }
              }
              answers.crud_fieldObjects.push(nextAnswers[field]);
            });
            const ret = Object.assign({}, answers, {
              crud_fieldMap: nextAnswers,
            });
            return ret;
          });
        }
      })
      .catch((err) => {
        console.error(`Erro: ${err}`, err);
      });
  },
};
