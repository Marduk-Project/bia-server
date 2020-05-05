const moment = require("moment");
const chalk = require("chalk");

module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: "input",
        name: "name",
        message: `Name of the model to inject? (eg. gl_person) Insert the "${chalk.green("// inject")}" string on the model file.`,
        validate: (value) => {
          return value.length > 0;
        },
      },
      {
        type: "input",
        name: "enumName",
        message: "Name of enumerated field? (eg. level)",
        validate: (value) => {
          return value.length > 0;
        },
      },
      {
        type: "confirm",
        name: "enumIsInt",
        message: "This enum value is int?",
        initial: true,
      },
      {
        type: "list",
        name: "enumFields",
        message:
          'Type the enum options? (separate by comma: "admin, manager, normal, ...")',
        validate(value, state, item, index) {
          return value.length > 0;
        },
      },
    ];
    return inquirer.prompt(questions);
  },
};
