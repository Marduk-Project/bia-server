const { body, query, param } = require('express-validator/check');
const validator = require('validator');
const { Op } = require('sequelize');
const chalk = require('chalk');

const {
  customFindByPkValidation,
  customFindByPkRelationValidation,
  validationEndFunction,
  BadRequestError,
  ApiError,
  NotFoundError,
} = require('../../middlewares/error-mid');
const CtrModelModule = require('../../models/gl_city');
const Model = CtrModelModule.model;
const ParentModelModule = require('../../models/gl_state');
const ParentModel = ParentModelModule.model;
const utils = require('../../helpers/utils');
const StateRegionModelModule = require('../../models/gl_state_region');
const StateRegionModel = StateRegionModelModule.model;
const CityStateRegionModelModule = require('../../models/gl_city_state_region');
const CityStateRegionModel = CityStateRegionModelModule.model;

// const controllerDefaultQueryScope = 'visitor';

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('id').optional().isInt(),
  query('q').optional().isString(),
  query('stateId').optional().isInt(),
  query('code').optional(),
  validationEndFunction,
];

/**
 * List Index
 */
exports.getIndex = async (req, res, next) => {
  try {
    const options = {
      where: {},
    };
    // q
    if (req.query.q) {
      const q = req.query.q;
      options.where[Op.or] = {
        name: {
          [Op.like]: `${q}%`,
        },
        code: {
          [Op.like]: `${q}%`,
        },
      };
      if (validator.isNumeric(q, { no_symbols: true })) {
        options.where[Op.or].id = q;
      }
    }
    // id
    if (req.query.id) {
      options.where.id = req.query.id;
    }
    // code
    if (req.query.code) {
      options.where.code = req.query.code;
    }
    // stateId
    if (req.query.stateId) {
      options.where.stateId = req.query.stateId;
    }
    // query options
    const page = req.query.page || 1;
    Model.setLimitOffsetForPage(page, options);
    options.order = [
      ['priority', 'desc'],
      ['name', 'asc'],
      ['id', 'asc'],
    ];
    options.include = ['state'];
    // exec
    const queryResult = await Model.findAndCountAll(options);
    const meta = Model.paginateMeta(queryResult, page);
    res.sendJsonOK({
      data: await CtrModelModule.jsonSerializer(
        queryResult.rows,
        req.userContext
      ),
      meta: meta,
    });
  } catch (err) {
    next(err);
  }
};
