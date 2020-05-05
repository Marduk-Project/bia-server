const config = require('../../config');
const chalk = require('chalk');
const {
  checkIsConnected,
  mainDb,
} = require('../../server/database/main_connection.js');

exports.importToDatabase = async keepConnection => {
  try {
    let count = 0;
    let lastMessageCount = 0;
    console.log(
      chalk.green('Starting to import... it might take some time...')
    );
    await checkIsConnected();
    const { model: CountryModel } = require('../../server/models/gl_country');
    const { model: StateModel } = require('../../server/models/gl_state');
    const { model: CityModel } = require('../../server/models/gl_city');
    const StateRegionModelModule = require('../../server/models/gl_state_region');
    const StateRegionModel = StateRegionModelModule.model;
    const CityStateRegionModelModule = require('../../server/models/gl_city_state_region');
    const CityStateRegionModel = CityStateRegionModelModule.model;
    // states
    let [countryEntity, countryCreated] = await CountryModel.findOrCreate({
      where: {
        code: 'BRA',
      },
      defaults: {
        name: 'Brasil',
        priority: 1,
      },
    });
    let [stateEntity, stateCreated] = await StateModel.findOrCreate({
      where: {
        code: '43',
        countryId: countryEntity.id,
      },
      defaults: {
        name: 'Rio Grande do Sul',
        initials: 'RS',
        priority: 1,
      },
    });
    const incLogFunc = () => {
      count++;
      if (lastMessageCount + 100 < count) {
        lastMessageCount += 100;
        console.log(chalk.green(`...processed ${lastMessageCount} rows...`));
      }
    };
    const cityStateRegionBuilder = async (type, cityId, regionId) => {
      // city state region
      let cityRegion = await CityStateRegionModel.findByCityAndType(
        cityId,
        type
      );
      if (!cityRegion) {
        cityRegion = CityStateRegionModel.build({});
      }
      cityRegion.cityId = cityId;
      cityRegion.stateRegionId = regionId;
      cityRegion.type = type;
      incLogFunc();
      await cityRegion.save();
      return cityRegion;
    };
    const stateRegionBuilder = async (
      type,
      stateEntity,
      name,
      code,
      cityId
    ) => {
      let [regionEntity, regionCreated] = await StateRegionModel.findOrCreate({
        where: {
          stateId: stateEntity.id,
          code: code,
          type: type,
        },
        defaults: {
          name: name,
        },
      });
      if (regionCreated) {
        console.log(
          chalk.green(
            `Created ${type} ${regionEntity.code} / ${regionEntity.name} - ${stateEntity.initials}`
          )
        );
      }
      incLogFunc();
      await cityStateRegionBuilder(type, cityId, regionEntity.id);
    };
    // cities
    const citiesList = require('./rs_cities_regions_refined.json');
    console.log(chalk.green(`Cities loaded... starting script...`));
    console.log(chalk.green(`Importing ${citiesList.length} cities...`));
    const cityList = await CityModel.findAll({
      where: {
        stateId: stateEntity.id,
      },
    });
    cityList.forEach(cityEntity => {
      let found = false;
      for (let i = 0; i < citiesList.length; i++) {
        const cityJson = citiesList[i];
        if (cityEntity.name == cityJson.name) {
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(
          chalk.yellow(`City ${cityEntity.name} not found on json list!`)
        );
      }
    });
    for (let i = 0; i < citiesList.length; i++) {
      const cityJson = citiesList[i];
      incLogFunc();
      // city
      let name = cityJson.name;
      const cityEntity = await CityModel.findOne({
        where: {
          stateId: stateEntity.id,
          name: name,
        },
      });
      if (!cityEntity) {
        console.log(
          chalk.yellow(`City NOT FOUND: ${name} - ${stateEntity.initials}`)
        );
        continue;
      }
      // macro
      let code = cityJson.macroRegion.toUpperCase();
      name = cityJson.macroRegion;
      await stateRegionBuilder(
        StateRegionModelModule.TYPE_MACRO,
        stateEntity,
        name,
        code,
        cityEntity.id
      );
      // healthCoordenation
      code = cityJson.healthCoordenationRegion.replace(/\D/g, '');
      name = cityJson.healthCoordenationRegion;
      await stateRegionBuilder(
        StateRegionModelModule.TYPE_HEALTH_COORDENATION,
        stateEntity,
        name,
        code,
        cityEntity.id
      );
      // healthMicro
      code = cityJson.healthRegion.split('-')[0].trim();
      name = cityJson.healthRegion;
      await stateRegionBuilder(
        StateRegionModelModule.TYPE_HEALTH_MICRO,
        stateEntity,
        name,
        code,
        cityEntity.id
      );
    }
    console.log(chalk.green('Regions import is completed!'));
    if (!keepConnection) {
      await mainDb.close();
    }
    console.log(chalk.green('Done!'));
  } catch (err) {
    console.log(chalk.red('Error on importing data...'), err);
  }
};
