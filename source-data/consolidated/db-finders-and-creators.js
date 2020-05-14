const chalk = require('chalk');

const { model: CityModel } = require('../../server/models/gl_city');
const {
  model: PersonTypeModel,
} = require('../../server/models/gl_person_type');
const { model: PersonModel } = require('../../server/models/gl_person');
const { model: UnitModel } = require('../../server/models/gl_unit');
const { model: ProductModel } = require('../../server/models/gl_product');

exports.findCity = function findCity(name) {
  return find(CityModel, {
    where: { name },
  });
};

exports.findOrCreatePersonType = async function findOrCreatePersonType(
  name,
  cityId,
  priority
) {
  return find(PersonTypeModel, {
    where: { name, cityId },
    notFound: () => create(PersonTypeModel, { name, cityId, priority }),
  });
};

exports.findOrCreatePerson = async function findOrCreatePerson(
  name,
  cityId,
  priority
) {
  return find(PersonModel, {
    where: { name, cityId },
    notFound: () => {
      create(PersonModel, {
        name,
        cityId,
        priority,
        legalType: 6,
      });
      // TODO: save to log - incomplete registration
    },
  });
};

exports.findOrCreateUnit = async function findOrCreateUnit(name) {
  return find(UnitModel, {
    where: { name },
    notFound: () =>
      create(UnitModel, {
        name: name === 'Unidade(s)' ? 'Unidade(s)' : 'Litro(s)',
        nameSingular: name === 'Unidade(s)' ? 'Unidade' : 'Litro',
        namePlural: name === 'Unidade(s)' ? 'Unidades' : 'Litros',
      }),
  });
};

exports.findOrCreateProduct = async function findOrCreateProduct(
  name,
  unitId,
  consumable
) {
  return find(ProductModel, {
    where: { name },
    notFound: () => {
      create(ProductModel, {
        name,
        unitId,
        consumable,
      });
      // TODO: save to log - incomplete registration
    },
  });
};

// Utils
// ---
async function find(Model, { where, notFound }) {
  throwErrorOnWhereFieldsEmpty(Model.name, where);

  const objectsFound = await Model.findAll({
    where, // TODO: deconstruct object to apply LIKE on name fields
  });

  if (objectsFound.length === 1) {
    return objectsFound[0].id;
  } else if (objectsFound.length > 1) {
    throwError(
      `Error: Multiple results found on Model ${Model.name}
      Where: ${stringify(where)}
      Results: ${stringify(objectsFound)}`
    );
  } else {
    console.log(
      chalk.yellow(
        `No results found: ${Model.name} - where: ${stringify(where)}`
      )
    );

    if (typeof notFound === 'function') {
      return notFound();
    }
  }
}

async function create(Model, data) {
  const createdObject = await Model.create(data);
  console.log(chalk.green(`Created on ${Model.name}: ${stringify(data)}`));
  return createdObject.id;
}

function throwErrorOnWhereFieldsEmpty(stepName, where) {
  Object.values(where).forEach((value, index) => {
    if (value === undefined) {
      throwError(
        `Error on step ${stepName} - parameter ${
          Object.keys(where)[index]
        } blank.`
      );
    }
  });
}
function throwError(message) {
  console.log(chalk.red(`${message}\nSkipping this entry...`));
  throw new Error(message);
}

function stringify(content) {
  return JSON.stringify(content, null, 2);
}
