const fs = require("fs");
const { uniqBy } = require("lodash");
const xlsxFile = require("read-excel-file/node");

const schema = {
  nome: {
    prop: "name",
    type: String,
  },
  priorizado: {
    prop: "isPriority",
    type: String,
    parse(value) {
      return Boolean(value.trim().length > 0);
    },
  },
  Tipo: {
    prop: "type",
    type: String,
    oneOf: ["INSUMOS", "EQUIPAMENTOS"],
  },
};

console.log("Attempting to extract data from: ./products-list.xlsx");
const excelData = xlsxFile("./products-list.xlsx", {
  schema,
})
  .then(({ rows, errors }) => rows)
  .then((rows) => uniqBy(rows, "name"))
  .then((rows) => rows.filter((row) => Boolean(row.name && row.type)))
  .then(writeToJSONFile);

function writeToJSONFile(data) {
  console.log("Saving extracted date to: ./products-list.json");
  return fs.writeFileSync(
    "./products-list.json",
    JSON.stringify(data, null, 2)
  );
}
