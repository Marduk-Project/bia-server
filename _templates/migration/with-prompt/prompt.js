const moment = require("moment");

module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: "input",
        name: "name",
        message: "Name of the table/model? (eg. gl_person)",
        validate: (value) => {
          return value.length > 0;
        },
      },
      {
        type: "input",
        name: "migrationName",
        message: "Name of the migration? (eg. alter-table-gl-person-add-field)",
        validate: (value) => {
          return value.length > 0;
        },
      },
    ];
    return inquirer
      .prompt(questions)
      .then((answers) => {
        answers.migrationNameWithHyphen = answers.migrationName.replace(/_/g, "-");
        answers.nowPreffix = moment().format("YYYYMMDDHmmss");
        return answers;
      })
      .catch((err) => {
        console.error(`Erro: ${err}`, err);
      });
  },
};
