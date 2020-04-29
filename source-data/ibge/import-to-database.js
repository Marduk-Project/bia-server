const config = require('../../config')
const chalk = require('chalk')
const {
  checkIsConnected,
  mainDb,
} = require('../../server/database/main_connection.js')

exports.importToDatabase = async keepConnection => {
  try {
    let count = 0
    let lastMessageCount = 0
    console.log(
      chalk.green(
        'Starting to import... it will take time... are more then ~16k registers'
      )
    )
    await checkIsConnected()
    const { model: CountryModel } = require('../../server/models/gl_country')
    const { model: StateModel } = require('../../server/models/gl_state')
    const { model: CityModel } = require('../../server/models/gl_city')
    const StateRegionModelModule = require('../../server/models/gl_state_region')
    const StateRegionModel = StateRegionModelModule.model
    const CityStateRegionModelModule = require('../../server/models/gl_city_state_region')
    const CityStateRegionModel = CityStateRegionModelModule.model
    // states
    const states = require('./states.json')
    let [country, countryCreated] = await CountryModel.findOrCreate({
      where: {
        code: 'BRA',
      },
      defaults: {
        name: 'Brasil',
        priority: 1,
      },
    })
    await Promise.all(
      states.map(async stateJson => {
        // state
        let [stateEntity, stateCreated] = await StateModel.findOrCreate({
          where: {
            code: `${stateJson.code}`,
            countryId: country.id,
          },
          defaults: {
            name: stateJson.name,
            initials: stateJson.initials,
            priority: 0,
          },
        })
        if (stateCreated) {
          console.log(
            chalk.green(
              `Created state ${stateEntity.initials} / ${stateEntity.name} IBGE:${stateEntity.code}`
            )
          )
        }
        count++
      })
    )
    const incLogFunc = () => {
      count++
      if (lastMessageCount + 100 < count) {
        lastMessageCount += 100
        console.log(chalk.green(`...processed ${lastMessageCount} rows...`))
      }
    }
    const stateRegionBuilder = async (type, cityId, regionId) => {
      // city state region
      let cityRegion = await CityStateRegionModel.findByCityAndType(
        cityId,
        type
      )
      if (!cityRegion) {
        cityRegion = CityStateRegionModel.build({})
      }
      cityRegion.cityId = cityId
      cityRegion.stateRegionId = regionId
      cityRegion.type = type
      incLogFunc()
      await cityRegion.save()
      return cityRegion
    }
    // cities
    console.log(chalk.green(`States are done! Loading cities...`))
    const { cities } = require('./cities.json')
    console.log(chalk.green(`Cities loaded... starting script...`))
    for (let i = 0; i < cities.length; i++) {
      const cityJson = cities[i]
      incLogFunc()
      // state
      let stateEntity = await StateModel.findByCode(cityJson.stateCode)
      // meso
      let [
        mesoRegionEntity,
        mesoRegionCreated,
      ] = await StateRegionModel.findOrCreate({
        where: {
          stateId: stateEntity.id,
          code: cityJson.mesoRegionCode,
          type: StateRegionModelModule.TYPE_MESO,
        },
        defaults: {
          name: cityJson.mesoRegionName,
        },
      })
      if (mesoRegionCreated) {
        console.log(
          chalk.green(
            `Created Mesorregion ${mesoRegionEntity.code} / ${mesoRegionEntity.name} - ${stateEntity.initials}`
          )
        )
      }
      // micro
      let [
        microRegionEntity,
        microRegionCreated,
      ] = await StateRegionModel.findOrCreate({
        where: {
          stateId: stateEntity.id,
          code: cityJson.microRegionCode,
          type: StateRegionModelModule.TYPE_MICRO,
        },
        defaults: {
          name: cityJson.mesoRegionName,
        },
      })
      if (microRegionCreated) {
        console.log(
          chalk.green(
            `Created Microrregion ${microRegionEntity.code} / ${microRegionEntity.name} - ${stateEntity.initials}`
          )
        )
      }
      // city
      let [cityEntity, cityCreated] = await CityModel.findOrCreate({
        where: {
          code: cityJson.cityCodeComplete,
          stateId: stateEntity.id,
        },
        defaults: {
          name: cityJson.cityName,
          priority: 0,
        },
      })
      if (cityCreated) {
        console.log(
          chalk.green(
            `Created City ${cityEntity.code} / ${cityEntity.name} - ${stateEntity.initials}`
          )
        )
      }
      // meso
      await stateRegionBuilder(
        StateRegionModelModule.TYPE_MESO,
        cityEntity.id,
        mesoRegionEntity.id
      )
      // micro
      await stateRegionBuilder(
        StateRegionModelModule.TYPE_MICRO,
        cityEntity.id,
        microRegionEntity.id
      )
      incLogFunc()
    }
    console.log(chalk.green('Cities import is completed!'))
    if (!keepConnection) {
      await mainDb.close()
    }
    console.log(chalk.green('Import is completed!'))
  } catch (err) {
    console.log(chalk.red('Error on importing IBGE data...'), err)
  }
}
