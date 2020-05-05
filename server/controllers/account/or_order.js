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
const CtrModelModule = require('../../models/or_order');
const Model = CtrModelModule.model;
const GL_UserModule = require('../../models/gl_user');
const GL_UserModel = GL_UserModule.model;
const GL_PersonModule = require('../../models/gl_person');
const GL_PersonModel = GL_PersonModule.model;
const GL_PersonContactModule = require('../../models/gl_person_contact');
const GL_PersonContactModel = GL_PersonContactModule.model;

// const utils = require('../../helpers/utils');
const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = 'account';

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
        // TODO other text query fields here
      };
      if (validator.isNumeric(q, { no_symbols: true })) {
        options.where[Op.or].id = q;
      }
    }
    // query options
    const page = req.query.page || 1;
    Model.setLimitOffsetForPage(page, options);
    options.order = [
      // ['name', 'asc'], // TODO check order
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
  body('type').isInt(),
  body('glPersonOriginId')
    .isInt()
    .custom(
      customFindByPkRelationValidation(GL_PersonModel, 'entity_personOrigin')
    ),
  body('glPersonContactOriginId')
    .isInt()
    .custom(
      customFindByPkRelationValidation(
        GL_PersonContactModel,
        'entity_personOriginContact'
      )
    ),
  body('glPersonDestinationId')
    .isInt()
    .custom(
      customFindByPkRelationValidation(
        GL_PersonModel,
        'entity_personDestination'
      )
    ),
  body('glPersonContactDestinationId')
    .isInt()
    .custom(
      customFindByPkRelationValidation(
        GL_PersonContactModel,
        'entity_personContactDestination'
      )
    ),
  body('notes').optional().trim(),
  body('internalNotes').optional().trim(),
  body('status').optional().isInt(),
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
    entity.type = body.type;
    entity.glUserId = body.glUserId;
    entity.glPersonOriginId = body.glPersonOriginId;
    entity.glPersonContactOriginId = body.glPersonContactOriginId;
    entity.glPersonDestinationId = body.glPersonDestinationId;
    entity.glPersonContactDestinationId = body.glPersonContactDestinationId;
    entity.notes = body.notes;
    entity.internalNotes = body.internalNotes;
    entity.needsReview = !id && body.notes;
    entity.status = body.status;
    // save
    // await entity.save();
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
