const { Op } = require('sequelize');

const models = {
  gl_product: require(`../server/models/gl_product`).model,
  gl_person: require(`../server/models/gl_person`).model,
  gl_unit: require(`../server/models/gl_unit`).model,
  // gl_city: require(`../server/models/gl_city`).model,
};

const idByModel = {};

function matchItems(breakdown) {
  const matchRequests = breakdown.reduce((all, breakdownItem) => {
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
      attributes: ['id'],
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
    if (!idByModel[modelName]) {
      idByModel[modelName] = {};
    }
    idByModel[modelName][itemName] = id;
    return id;
  };
}

exports.matchItems = matchItems;
exports.idByModel = idByModel;
