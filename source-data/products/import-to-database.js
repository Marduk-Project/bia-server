const config = require('../../config');
const chalk = require('chalk');
const utils = require('../import_utils');

const {
  checkIsConnected,
  mainDb,
} = require('../../server/database/main_connection.js');

exports.importToDatabase = async keepConnection => {
  try {
    let count = 0;
    console.log(
      chalk.green('Starting to import... it might take some time...')
    );
    await checkIsConnected();
    const { model: ProductModel } = require('../../server/models/gl_product');
    const { model: UnitModel } = require('../../server/models/gl_unit');
    // liter
    const [literEntity, literCreated] = await UnitModel.findOrCreate({
      where: {
        unit: 'L',
      },
      defaults: {
        name: 'Litro(s)',
        nameSingular: 'Litro',
        namePlural: 'Litros',
      },
    });
    if (literCreated) {
      console.log(chalk.green('Created Litro(s) [L] unit.'));
    }
    // unit
    const [unitEntity, unitCreated] = await UnitModel.findOrCreate({
      where: {
        unit: 'UN',
      },
      defaults: {
        name: 'Unidade(s)',
        nameSingular: 'Unidade',
        namePlural: 'Unidades',
      },
    });
    if (unitCreated) {
      console.log(chalk.green('Created Unidade(s) [UN] unit.'));
    }
    // items
    const jsonList = require('./products-list.json');
    for (let i = 0; i < jsonList.length; i++) {
      const jsonObject = jsonList[i];
      count = utils.incLog(count, 10);
      let [entity, entityCreated] = await ProductModel.findOrCreate({
        where: {
          name: jsonObject.name,
        },
        defaults: {
          unitId:
            jsonObject.unit == 'Litro(s)' ? literEntity.id : unitEntity.id,
        },
      });
      if (entityCreated) {
        console.log(chalk.green(`Product ${jsonObject.name} created!`));
      }
      entity.nameSingular = jsonObject.name;
      entity.namePlural = jsonObject.name;
      entity.unitId =
        jsonObject.unit == 'Litro(s)' ? literEntity.id : unitEntity.id;
      entity.consumable = jsonObject.type == 'INSUMOS';
      entity.priority = jsonObject.isPriority.includes('Não') ? 0 : 1;
      entity.requestFormActive = true;
      await entity.save();
    }
    if (!keepConnection) {
      await mainDb.close();
    }
    console.log(chalk.green('Import is completed!'));
  } catch (err) {
    console.log(chalk.red('Error on importing data...'), err);
  }
};
