const { body, query, param } = require('express-validator/check');
const validator = require('validator');
const { Op } = require('sequelize');

const {
  customFindByPkValidation,
  customFindByPkRelationValidation,
  validationEndFunction,
  BadRequestError,
  ApiError,
  NotFoundError,
} = require('../../middlewares/error-mid');
const CtrModelModule = require('../../models/gl_state');
const Model = CtrModelModule.model;
const ParentModelModule = require('../../models/gl_country');
const ParentModel = ParentModelModule.model;
const utils = require('../../helpers/utils');

const controllerDefaultQueryScope = 'visitor';

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
  query('countryId').optional().isInt(),
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
        initials: {
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
    // countryId
    if (req.query.countryId) {
      options.where.countryId = req.query.countryId;
    }
    // query options
    const page = req.query.page || 1;
    Model.setLimitOffsetForPage(page, options);
    options.order = [
      ['priority', 'desc'],
      ['name', 'asc'],
      ['id', 'asc'],
    ];
    options.include = ['country'];
    // exec
    const queryResult = await Model.findAndCountAll(options);
    const meta = Model.paginateMeta(queryResult, page);
    res.sendJsonOK({
      data: await CtrModelModule.jsonSerializer(
        queryResult.rows,
        controllerDefaultQueryScope
      ),
      meta: meta,
    });
  } catch (err) {
    next(err);
  }
};
