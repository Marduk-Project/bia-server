const { body, query, param } = require('express-validator/check');
const validator = require('validator');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const _ = require('lodash');

const { mainDb } = require('../../database/main_connection');

const {
  customFindByPkValidation,
  customFindByPkRelationValidation,
  validationEndFunction,
  BadRequestError,
  ApiError,
  NotFoundError,
} = require('../../middlewares/error-mid');

const GL_PersonModule = require('../../models/gl_person');
const GL_PersonModel = GL_PersonModule.model;
const GL_StateModule = require('../../models/gl_state');
const GL_StateModel = GL_StateModule.model;
const GL_CityModule = require('../../models/gl_city');
const GL_CityModel = GL_CityModule.model;
const GL_StateRegionModule = require('../../models/gl_state_region');
const GL_StateRegionModel = GL_StateRegionModule.model;
const GL_CityStateRegionModule = require('../../models/gl_city_state_region');
const GL_CityStateRegionModel = GL_CityStateRegionModule.model;
const OR_OrderConsolidatedModule = require('../../models/or_order_consolidated');
const OR_OrderConsolidatedModel = OR_OrderConsolidatedModule.model;

// const utils = require('../../helpers/utils');
const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = 'visitor';

exports.getStateDashboardReportValidate = [
  query('glStateId')
    .optional()
    .isInt()
    .custom(customFindByPkValidation(GL_StateModel)),
  query('glStateRegionId')
    .optional()
    .isInt()
    .custom(customFindByPkValidation(GL_StateRegionModel)),
  query('glCityId')
    .optional()
    .isInt()
    .custom(customFindByPkValidation(GL_CityModel)),
  (req, res, next) => {
    if (
      !req.query.glStateId &&
      !req.query.glCityId &&
      !req.query.glStateRegionId
    ) {
      next(new Error('Filtros inválidos'));
      return;
    }
    next();
  },
  validationEndFunction,
];

/**
 * List Index
 */
exports.getStateDashboardReport = async (req, res, next) => {
  try {
    const stateId = req.query.glStateId;
    const cityId = req.query.glCityId;
    const stateRegionId = req.query.glStateRegionId;

    const orderConsolidatedSubquery = mainDb.dialect.QueryGenerator.selectQuery(
      OR_OrderConsolidatedModel.getTableName(),
      {
        attributes: ['glPersonDestinationId'],
        where: {
          [Op.and]: [
            { requestQuantity: { [Op.gt]: 0 } },
            {
              glPersonDestinationId: { [Op.eq]: sequelize.col('gl_person.id') },
            },
          ],
        },
        group: ['glPersonDestinationId'],
      }
    ).slice(0, -1); // to remove the ';' from the end of the SQL;

    // === person by types
    let whereObj = (() => {
      if (cityId) {
        return {
          cityId: cityId,
          '$city->regions.type$': GL_StateRegionModule.TYPE_MACRO,
          '$city->regions.stateRegion.type$': GL_StateRegionModule.TYPE_MACRO,
        };
      } else if (stateRegionId) {
        return {
          '$city->regions.type$': GL_StateRegionModule.TYPE_MACRO,
          '$city->regions.stateRegion.type$': GL_StateRegionModule.TYPE_MACRO,
          '$city->regions.stateRegionId$': stateRegionId,
        };
      } else if (stateId) {
        return {
          '$city.stateId$': stateId,
          '$city->regions.type$': GL_StateRegionModule.TYPE_MACRO,
          '$city->regions.stateRegion.type$': GL_StateRegionModule.TYPE_MACRO,
          '$city->regions.stateRegion.stateId$': stateId,
        };
      }
    })();
    if (!whereObj[Op.and]) {
      whereObj[Op.and] = [];
    }
    whereObj[Op.and].push({
      id: {
        [Op.in]: sequelize.literal('(' + orderConsolidatedSubquery + ')'),
      },
    });

    let includeObj = [
      {
        association: 'city',
        attributes: ['id', 'name', 'code'],
        include: [
          {
            association: 'regions',
            attributes: [],
            where: {
              type: GL_StateRegionModule.TYPE_MACRO,
            },
            include: [
              {
                association: 'stateRegion',
                attributes: [],
                where: {
                  type: GL_StateRegionModule.TYPE_MACRO,
                },
              },
            ],
          },
        ],
      },
      {
        association: 'personType',
        attributes: ['id', 'name'],
      },
    ];
    const personsByTypeCount = await GL_PersonModel.findAll({
      attributes: [
        'personTypeId',
        [sequelize.fn('COUNT', 'personTypeId'), 'count'],
        [sequelize.col('personType.name'), 'personTypeName'],
      ],
      where: whereObj,
      include: includeObj,
      group: ['personTypeId'],
      order: [[sequelize.col('count'), 'desc']],
    });

    // calc
    let countTotal = parseFloat(
      personsByTypeCount.reduce((sum, item) => sum + item.toJSON().count, 0)
    );
    const personsByTypeCountJson = {
      items: personsByTypeCount.map(item => {
        const itemJson = item.toJSON();
        itemJson.percentual = ((itemJson.count / countTotal) * 100).toFixed(1);
        return itemJson;
      }),
      count: countTotal,
    };

    // === person by region
    const personsByStateRegionsCount = await GL_PersonModel.findAll({
      attributes: [
        [sequelize.fn('COUNT', 'cityId'), 'count'],
        [sequelize.col('stateRegionId'), 'stateRegionId'],
        [sequelize.col('city->regions.stateRegion.name'), 'stateRegionName'],
      ],
      where: whereObj,
      include: includeObj,
      group: [[sequelize.col('city->regions.stateRegionId'), 'stateRegionId']],
      order: [[sequelize.col('count'), 'desc']],
    });

    // calc
    countTotal = personsByStateRegionsCount.reduce(
      (sum, item) => sum + item.toJSON().count,
      0
    );
    const personsByStateRegionsCountJson = {
      items: personsByStateRegionsCount.map(item => {
        const itemJson = item.toJSON();
        itemJson.percentual = ((itemJson.count / countTotal) * 100).toFixed(1);
        return itemJson;
      }),
      count: countTotal,
    };

    // === person list
    const personList = await GL_PersonModel.findAll({
      attributes: ['id', 'shortname', 'name', 'cityId', 'personTypeId'],
      where: whereObj,
      include: includeObj,
      order: [
        ['name', 'asc'],
        ['id', 'asc'],
      ],
    });

    // === priority items
    whereObj = (() => {
      const where = {
        [Op.and]: [
          {
            [Op.or]: [
              {
                [Op.and]: [
                  { requestQuantity: { [Op.ne]: 0 } },
                  { requestQuantity: { [Op.ne]: null } },
                ],
              },
              {
                [Op.and]: [
                  { supplyReserveQuantity: { [Op.ne]: 0 } },
                  { supplyReserveQuantity: { [Op.ne]: null } },
                ],
              },
              {
                [Op.and]: [
                  { supplyTransportQuantity: { [Op.ne]: 0 } },
                  { supplyTransportQuantity: { [Op.ne]: null } },
                ],
              },
            ],
          },
          {
            '$glProduct.requestFormActive$': 1,
          },
        ],
      };
      if (cityId) {
        where[Op.and].push({
          '$glPersonDestination.cityId$': cityId,
          '$glPersonDestination.city->regions.type$':
            GL_StateRegionModule.TYPE_MACRO,
          '$glPersonDestination.city->regions.stateRegion.type$':
            GL_StateRegionModule.TYPE_MACRO,
        });
      } else if (stateRegionId) {
        where[Op.and].push({
          '$glPersonDestination.city->regions.type$':
            GL_StateRegionModule.TYPE_MACRO,
          '$glPersonDestination.city->regions.stateRegion.type$':
            GL_StateRegionModule.TYPE_MACRO,
          '$glPersonDestination.city->regions.stateRegionId$': stateRegionId,
        });
      } else if (stateId) {
        where[Op.and].push({
          '$glPersonDestination.city->regions.type$':
            GL_StateRegionModule.TYPE_MACRO,
          '$glPersonDestination.city->regions.stateRegion.type$':
            GL_StateRegionModule.TYPE_MACRO,
          '$glPersonDestination.city.stateId$': stateId,
        });
      }
      return where;
    })();
    const priorityOrderProductList = await OR_OrderConsolidatedModel.findAll({
      attributes: [
        ['glProductId', 'productId'],
        [sequelize.col('glProduct.name'), 'productName'],
        [sequelize.col('glUnit.name'), 'unitName'],
        [sequelize.col('glUnit.unit'), 'unit'],
        [
          sequelize.fn('sum', sequelize.col('requestQuantity')),
          'requestQuantitySum',
        ],
        [
          sequelize.fn('sum', sequelize.col('supplyReserveQuantity')),
          'supplyReserveQuantitySum',
        ],
        [
          sequelize.fn('sum', sequelize.col('supplyTransportQuantity')),
          'supplyTransportQuantitySum',
        ],
      ],
      where: whereObj,
      include: [
        { association: 'glProduct', attributes: [] },
        { association: 'glUnit', attributes: [] },
        {
          association: 'glPersonDestination',
          attributes: [],
          include: [
            {
              association: 'city',
              attributes: [],
              include: [
                {
                  association: 'regions',
                  attributes: [],
                  include: [
                    {
                      association: 'stateRegion',
                      attributes: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      group: ['glProductId', 'glUnitId'],
      order: [[sequelize.col('requestQuantitySum'), 'desc']],
    });

    // === state regions
    const findStateRegions = async () => {
      return await GL_CityStateRegionModule.jsonSerializer(
        await GL_StateRegionModel.findAllByTypeAndStateIdOrderByName(
          GL_StateRegionModule.TYPE_MACRO,
          stateId
        ),
        controllerDefaultQueryScope
      );
    };

    // === entity info
    const findEntityInfo = async () => {
      if (cityId) {
        return await GL_CityModule.jsonSerializer(
          await GL_CityModel.findByPk(cityId, {
            include: ['state'],
          }),
          controllerDefaultQueryScope
        );
      } else if (stateRegionId) {
        return await GL_StateRegionModule.jsonSerializer(
          await GL_StateRegionModel.findByPk(stateRegionId),
          controllerDefaultQueryScope
        );
      } else if (stateId) {
        return await GL_StateModule.jsonSerializer(
          await GL_StateModel.findByPk(stateId),
          controllerDefaultQueryScope
        );
      }
    };

    res.sendJsonOK({
      data: {
        entity: await findEntityInfo(),
        personList: await GL_PersonModule.jsonSerializer(
          personList,
          controllerDefaultQueryScope
        ),
        personsByType: personsByTypeCountJson,
        personsByStateRegion: personsByStateRegionsCountJson,
        priorityOrderProducts: priorityOrderProductList,
        stateRegionList: stateId ? await findStateRegions() : undefined,
      },
    });
  } catch (err) {
    next(err);
  }
};
