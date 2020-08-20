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
const CtrModelModule = require('../../models/sy_config');
const Model = CtrModelModule.model;

// const utils = require('../../helpers/utils');
const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = 'admin';

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
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
    // query options
    const page = req.query.page || 1;
    Model.setLimitOffsetForPage(page, options);
    options.order = [
      ['code', 'asc'],
      ['name', 'asc'],
      ['id', 'asc'],
    ];
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
  param('id').isInt().not().isEmpty().custom(customFindByPkValidation(Model)),
  validationEndFunction,
];

/**
 * Get for Edit
 */
exports.getEdit = async (req, res, next) => {
  try {
    const entity = req.entity;
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
 * Save validation
 */
const saveValidate = [
  param('id').optional().isInt(),
  body('code').trim().not().isEmpty().isLength({
    min: 1,
    max: 60,
  }),
  body('name').trim().not().isEmpty().isLength({
    min: 1,
    max: 90,
  }),
  body('valueString1').optional().trim(),
  body('valueString2').optional().trim(),
  body('valueString3').optional().trim(),
  body('valueText1').optional().trim(),
  body('valueText2').optional().trim(),
  body('valueText3').optional().trim(),
  body('valueInt1').optional().isInt(),
  body('valueInt2').optional().isInt(),
  body('valueInt3').optional().isInt(),
  body('valueDouble1').optional().isNumeric(),
  body('valueDouble2').optional().isNumeric(),
  body('valueDouble3').optional().isNumeric(),
  body('valueBoolean1').optional().isBoolean(),
  body('valueBoolean2').optional().isBoolean(),
  body('valueBoolean3').optional().isBoolean(),
  body('valueDate1').optional().custom(helperValidator.isDate8601Func(true)),
  body('valueDate2').optional().custom(helperValidator.isDate8601Func(true)),
  body('valueDate3').optional().custom(helperValidator.isDate8601Func(true)),
  // validationEndFunction, // dont need here, is attached below
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
    // fields
    entity.code = body.code;
    entity.name = body.name;
    entity.valueString1 = body.valueString1;
    entity.valueString2 = body.valueString2;
    entity.valueString3 = body.valueString3;
    entity.valueText1 = body.valueText1;
    entity.valueText2 = body.valueText2;
    entity.valueText3 = body.valueText3;
    entity.valueInt1 = body.valueInt1 || 0;
    entity.valueInt2 = body.valueInt2 || 0;
    entity.valueInt3 = body.valueInt3 || 0;
    entity.valueDouble1 = body.valueDouble1 || 0;
    entity.valueDouble2 = body.valueDouble2 || 0;
    entity.valueDouble3 = body.valueDouble3 || 0;
    entity.valueBoolean1 = body.valueBoolean1 || false;
    entity.valueBoolean2 = body.valueBoolean2 || false;
    entity.valueBoolean3 = body.valueBoolean3 || false;
    entity.valueDate1 = body.valueDate1;
    entity.valueDate2 = body.valueDate2;
    entity.valueDate3 = body.valueDate3;
    // save
    await entity.save();
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
    // const id = req.params.id;
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

exports.getPublicConfigDataValidate = [
  param('code')
    .isIn(CtrModelModule.common.CODE_ALL)
    .custom(code => {
      const supportedList = [
        CtrModelModule.common.CODE_PROJECT_DEVELOPERS_JSON,
      ];
      if (!supportedList.includes(code)) {
        throw new ApiError('Config not yet supported');
      }
      return true;
    })
    .custom(async (code, { req }) => {
      req.entity = await Model.findByCode(code);
      if (!req.entity) {
        throw new ApiError('Configuração não encontrada.');
      }
      return true;
    }),
  validationEndFunction,
];

exports.getPublicConfigData = async (req, res, next) => {
  try {
    const entity = req.entity;
    const code = req.params.code;
    switch (code) {
      case CtrModelModule.common.CODE_PROJECT_DEVELOPERS_JSON:
        res.sendJsonOK({
          data: JSON.parse(entity.valueText1),
        });
        break;
    }
  } catch (err) {
    next(err);
  }
};
