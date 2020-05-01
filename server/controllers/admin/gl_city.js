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

const controllerDefaultQueryScope = 'admin';

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
  query('stateId').optional().isInt(),
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
        code: {
          [Op.iLike]: `${q}%`,
        },
      };
      if (validator.isNumeric(q, { no_symbols: true })) {
        options.where[Op.or].id = q;
      }
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
        controllerDefaultQueryScope
      ),
      meta: meta,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get for Edit Validate
 */
exports.getEditValidate = [
  param('id')
    .isInt()
    .not()
    .isEmpty()
    .custom(customFindByPkValidation(Model, null, { include: ['state'] })),
  validationEndFunction,
];

/**
 * Get for Edit
 */
exports.getEdit = async (req, res, next) => {
  try {
    const entity = req.entity;
    res.sendJsonOK({
      data: await CtrModelModule.jsonSerializer(entity, 'admin_edit'),
    });
  } catch (err) {
    next(err);
  }
};

const stateRegionValidator = type => {
  return async (value, { req }) => {
    if (!req.body.stateId) {
      throw new ApiError('Campo stateId precisa ser preenchido.');
    }
    if (!value) {
      return true;
    }
    if (
      !(await StateRegionModel.existsByIdAndTypeStateId(
        value,
        type,
        req.body.stateId
      ))
    ) {
      throw new ApiError(`Região $(type) não encontrada!`);
    }
    return true;
  };
};

/**
 * Save validation
 */
const saveValidate = [
  param('id').optional().isInt(),
  body('name').isString().trim().not().isEmpty().isLength({
    min: 1,
    max: 60,
  }),
  body('code').isString().trim().isLength({
    min: 1,
    max: 60,
  }),
  body('initials').optional().trim().isLength({
    min: 0,
    max: 60,
  }),
  body('stateId')
    .isInt()
    .custom(customFindByPkRelationValidation(ParentModel, null)),
  body('mesoRegionId')
    .optional({ checkFalsy: true })
    .isInt()
    .custom(stateRegionValidator(StateRegionModelModule.TYPE_MESO)),
  body('microRegionId')
    .optional({ checkFalsy: true })
    .isInt()
    .custom(stateRegionValidator(StateRegionModelModule.TYPE_MICRO)),
  body('dreRegionId')
    .optional({ checkFalsy: true })
    .isInt()
    .custom(stateRegionValidator(StateRegionModelModule.TYPE_DRE)),
  // validationEndFunction, // aqui nao tem validate
];

const saveEntityFunc = async (req, res, next, id) => {
  try {
    const body = req.body;
    let entity = null;
    if (id) {
      entity = req.entity;
    } else {
      entity = Model.build({});
    }
    entity.name = body.name;
    entity.code = body.code;
    entity.initials = body.initials;
    entity.priority = body.priority;
    entity.stateId = body.stateId;
    await entity.save();
    await entity.setStateRegion(
      body.mesoRegionId,
      StateRegionModelModule.TYPE_MESO
    );
    await entity.setStateRegion(
      body.microRegionId,
      StateRegionModelModule.TYPE_MICRO
    );
    await entity.setStateRegion(
      body.dreRegionId,
      StateRegionModelModule.TYPE_DRE
    );
    // send result
    const result = {
      entity: {
        id: entity.id,
      },
    };
    // correct http
    if (id) {
      res.sendJsonOK(result);
    } else {
      res.sendJsonCreatedOK(result);
    }
  } catch (err) {
    next(err);
  }
};

/** Update validation */
exports.putUpdateValidate = [
  ...saveValidate,
  param('id').isInt().custom(customFindByPkValidation(Model)),
  validationEndFunction,
];

/**
 * Update
 */
exports.putUpdate = async (req, res, next) => {
  try {
    await saveEntityFunc(req, res, next, req.params.id);
  } catch (err) {
    next(err);
  }
};

/**
 * Create validation
 */
exports.postCreateValidate = [...saveValidate, validationEndFunction];

/**
 * Create
 */
exports.postCreate = async (req, res, next) => {
  try {
    await saveEntityFunc(req, res, next);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Validate
 */
exports.deleteValidate = [
  param('id').isInt().custom(customFindByPkValidation(Model)),
  validationEndFunction,
];

/**
 * Delete
 */
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const entity = req.entity;
    await entity.destroy();
    res.sendJsonOK({
      data: await CtrModelModule.jsonSerializer(
        entity,
        controllerDefaultQueryScope
      ),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete
 */
exports.postIbgeImport = async (req, res, next) => {
  try {
    const {
      importToDatabase,
    } = require('../../../source-data/ibge/import-to-database');
    // start async
    importToDatabase(true).catch(err => {
      console.log(chalk.red('Error importing IBGE data...', err));
    });
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};
