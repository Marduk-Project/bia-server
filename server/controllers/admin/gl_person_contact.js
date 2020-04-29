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

const controllerDefaultQueryScope = 'admin';

const includeDefaultOption = ['person', 'personReference', 'user'];

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
  query('personId').optional().isInt(),
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

/**
 * Get for Edit Validate
 */
exports.getEditValidate = [
  param('id')
    .isInt()
    .not()
    .isEmpty()
    .custom(
      customFindByPkValidation(Model, null, { include: includeDefaultOption })
    ),
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
  body('name').isString().trim().not().isEmpty().isLength({
    min: 1,
    max: 60,
  }),
  body('phone')
    .optional()
    .isLength({
      max: 60,
    })
    .custom(value => {
      // TODO phone validator
      return true;
    }),
  body('cellphone')
    .optional()
    .trim()
    .isLength({
      max: 60,
    })
    .custom(value => {
      // TODO phone validator
      return true;
    }),
  body('email').optional({ checkFalsy: true }).isEmail(),
  body('personId')
    .isInt()
    .custom(customFindByPkRelationValidation(PersonModel)),
  body('personReferenceId')
    .optional({ checkFalsy: true })
    .isInt()
    .custom(customFindByPkRelationValidation(PersonModel))
    .custom(async (value, { req }) => {
      if (value) {
        if (value == req.body.personId) {
          throw new ApiError('Não pode vincular-se ao próprio registro pai.');
        }
        let count = 0;
        if (req.params.id) {
          count = await Model.count({
            where: {
              personReferenceId: value,
              personId: req.body.personId,
              id: {
                [Op.ne]: req.params.id,
              },
            },
          });
        } else {
          count = await Model.count({
            where: {
              personReferenceId: value,
              personId: req.body.personId,
            },
          });
        }
        if (count > 0) {
          throw new ApiError(
            'Pessoa referência já vinculada em outro cadastro.'
          );
        }
      }
      return true;
    }),
  body('userId')
    .optional({ checkFalsy: true })
    .isInt()
    .custom(customFindByPkRelationValidation(UserModel))
    .custom(async (value, { req }) => {
      if (value) {
        let count = 0;
        if (req.params.id) {
          count = await Model.count({
            where: {
              userId: value,
              personId: req.body.personId,
              id: {
                [Op.ne]: req.params.id,
              },
            },
          });
        } else {
          count = await Model.count({
            where: {
              userId: value,
              personId: req.body.personId,
            },
          });
        }
        if (count > 0) {
          throw new ApiError('Usuário já vinculado à esta pessoa.');
        }
      }
      return true;
    }),
  body('level').isIn(CtrModelModule.LEVEL_ALL),
  body('obs').optional().trim().isLength({
    max: 5000,
  }),
  body('canRegisterPPERequest').isBoolean(),
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
    entity.personId = body.personId;
    entity.personReferenceId = body.personReferenceId;
    entity.userId = body.userId;
    entity.name = body.name;
    entity.shortname = body.shortname;
    entity.phone = body.phone;
    entity.cellphone = body.cellphone;
    entity.email = body.email;
    entity.obs = body.obs;
    entity.level = body.level;
    entity.canRegisterPPERequest = body.canRegisterPPERequest;
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
