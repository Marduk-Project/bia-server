require("../config.js");

const { breakdownToMatch } = require("./read-consolidated");

const { Op } = require("sequelize");
const { checkIsConnected } = require("../server/database/main_connection.js");

const fetchedIds = {};
const models = {
  gl_person: require(`../server/models/gl_person`).model,
  gl_city: require(`../server/models/gl_city`).model,
};

function matchItems(breakdown = breakdownToMatch) {
  // 1. read excel
  // 2. creates breadown as
  //   [
  //     {
  //       key: 'cityName',
  //       model: 'gl_city',
  //       modelField: 'name',
  //       list: ['porto alegre', 'novo hamburgo'],
  //     },
  //   ];
  // 3. fetches id from the breakdown to each value.
  // 4. when saving we can refer to the id of each value from `fetchedIds['gl_city']['porto alegre']`
  const matchRequests = breakdownToMatch.reduce((all, breakdownItem) => {
    all.push(
      ...breakdownItem.list.map(({ name }) =>
        fetchIdFromModel({
          modelName: breakdownItem.model,
          modelField: breakdownItem.modelField,
          itemName: name,
        })
      )
    );
    return all;
  }, []);
  return Promise.all(matchRequests);
}

async function fetchIdFromModel({ modelName, modelField, itemName }) {
  return await models[modelName]
    .findAll({
      attributes: ["id"],
      where: {
        [modelField]: {
          [Op.iLike]: `%${itemName}%`,
        },
      },
    })
    .then(filterData)
    .then(saveIdToReference(modelName, itemName));
}
function filterData(input) {
  if (input && input[0] && input[0].dataValues) {
    return input[0].dataValues.id;
  }
}
function saveIdToReference(modelName, itemName) {
  return function _saveIdToReference(id) {
    if (!fetchedIds[modelName]) {
      fetchedIds[modelName] = {};
    }
    fetchedIds[modelName][itemName] = id;
    return id;
  };
}

checkIsConnected()
  .then(matchItems)
  .then(() => console.log(JSON.stringify(fetchedIds, null, 2)));
