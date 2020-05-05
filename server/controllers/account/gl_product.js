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
const CtrModelModule = require('../../models/gl_product');
const Model = CtrModelModule.model;
const UnitModelModule = require('../../models/gl_unit');
const UnitModel = UnitModelModule.model;

// const utils = require('../../helpers/utils');
const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = 'account';

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
  query('requestFormActive').optional().isInt(),
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
          [Op.iLike]: `${q}%`,
        },
        eanCode: {
          [Op.iLike]: `${q}%`,
        },
        healthCode: {
          [Op.iLike]: `${q}%`,
        },
      };
      if (validator.isNumeric(q, { no_symbols: true })) {
        options.where[Op.or].id = q;
      }
    }
    if (req.query.requestFormActive) {
      options.where.requestFormActive = true;
    }
    // query options
    const page = req.query.page || 1;
    Model.setLimitOffsetForPage(page, options);
    options.order = [
      ['name', 'asc'],
      ['id', 'asc'],
    ];
    options.include = ['unit'];
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
