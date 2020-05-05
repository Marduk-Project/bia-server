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
const CtrModelModule = require('../../models/gl_person_contact');
const Model = CtrModelModule.model;
const PersonModelModule = require('../../models/gl_person');
const PersonModel = PersonModelModule.model;
const UserModelModule = require('../../models/gl_user');
const UserModel = UserModelModule.model;

const controllerDefaultQueryScope = 'account';

const includeDefaultOption = ['person', 'personReference', 'user'];

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
  query('personId').isInt(),
  query('userId').optional().isInt(),
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
      };
      if (validator.isNumeric(q, { no_symbols: true })) {
        options.where[Op.or].id = q;
      }
    }
    // personId
    if (req.query.personId) {
      options.where.personId = req.query.personId;
    }
    // userId
    if (req.query.userId) {
      options.where.userId = req.query.userId;
    }
    // query options
    const page = req.query.page || 1;
    Model.setLimitOffsetForPage(page, options);
    options.order = [
      ['name', 'asc'],
      ['id', 'asc'],
    ];
    options.include = includeDefaultOption;
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
