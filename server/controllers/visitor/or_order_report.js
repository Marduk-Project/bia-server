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
const GL_StateRegionModule = require('../../models/gl_state_region');
const GL_StateRegionModel = GL_StateRegionModule.model;
const GL_CityStateRegionModule = require('../../models/gl_city_state_region');
const GL_CityStateRegionModel = GL_CityStateRegionModule.model;
const OR_OrderConsolidatedModule = require('../../models/or_order_consolidated');
const OR_OrderConsolidatedModel = OR_OrderConsolidatedModule.model;

// const utils = require('../../helpers/utils');
const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = 'account';

exports.getStateDashboardReportValidate = [
  param('glStateId').isInt().custom(customFindByPkValidation(GL_StateModel)),
  validationEndFunction,
];

/**
 * List Index
 */
exports.getStateDashboardReport = async (req, res, next) => {
  try {
    const stateId = req.params.glStateId;

    // === person by types
    const personsByTypeCount = await GL_PersonModel.findAll({
      attributes: [
        'personTypeId',
        [sequelize.fn('COUNT', 'personTypeId'), 'count'],
        [sequelize.col('personType.name'), 'personTypeName'],
      ],
      where: {
        '$city.stateId$': stateId,
      },
      include: [
        {
          association: 'personType',
          attributes: [],
        },
        {
          association: 'city',
          attributes: [],
        },
      ],
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

    // === person by state regions
    const personsByStateRegionsCount = await GL_PersonModel.findAll({
      attributes: [
        [sequelize.fn('COUNT', 'cityId'), 'count'],
        [sequelize.col('stateRegionId'), 'stateRegionId'],
        [sequelize.col('city->regions.stateRegion.name'), 'stateRegionName'],
      ],
      where: {
        '$city->regions.stateRegion.stateId$': stateId,
        '$city->regions.stateRegion.type$': GL_StateRegionModule.TYPE_MACRO,
        '$city->regions.type$': GL_StateRegionModule.TYPE_MACRO,
      },
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

    // === priority items
    const priorityOrderProductList = await OR_OrderConsolidatedModel.findAll({
      attributes: [
        ['glProductId', 'productId'],
        [sequelize.col('glProduct.name'), 'productName'],
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
      where: {
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
            '$glPersonDestination.city.stateId$': stateId,
            '$glProduct.requestFormActive$': 1,
          },
        ],
      },
      include: [
        { association: 'glProduct', attributes: [] },
        {
          association: 'glPersonDestination',
          attributes: [],
          include: [
            {
              association: 'city',
              attributes: [],
            },
          ],
        },
      ],
      group: ['glProductId'],
      order: [[sequelize.col('requestQuantitySum'), 'desc']],
    });

    res.sendJsonOK({
      data: {
        state: await GL_StateModule.jsonSerializer(
          await GL_StateModel.findByPk(stateId),
          controllerDefaultQueryScope
        ),
        personsByType: personsByTypeCountJson,
        personsByStateRegion: personsByStateRegionsCountJson,
        priorityOrderProducts: priorityOrderProductList,
      },
    });
  } catch (err) {
    next(err);
  }
};
