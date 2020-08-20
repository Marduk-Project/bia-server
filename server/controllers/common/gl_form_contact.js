const { body, query, param } = require('express-validator/check');
const validator = require('validator');
const { Op } = require('sequelize');
const nconf = require('nconf');

const {
  customFindByPkValidation,
  customFindByPkRelationValidation,
  validationEndFunction,
  BadRequestError,
  ApiError,
  NotFoundError,
} = require('../../middlewares/error-mid');
const CtrModelModule = require('../../models/gl_form_contact');
const Model = CtrModelModule.model;
const UserModule = require('../../models/gl_user');
const UserModel = UserModule.model;

// const utils = require('../../helpers/utils');
const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = 'admin';
const includeDefaultOption = ['userCreated', 'userResponse'];

const { FormContactMail } = require('../../mails/form_contact_mail');

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
        id: {
          [Op.eq]: q,
        },
        subject: {
          [Op.like]: `${q}%`,
        },
        message: {
          [Op.like]: `${q}%`,
        },
        response: {
          [Op.like]: `${q}%`,
        },
        internalNotes: {
          [Op.like]: `${q}%`,
        },
        personName: {
          [Op.like]: `${q}%`,
        },
        personEmail: {
          [Op.like]: `${q}%`,
        },
      };
      if (validator.isNumeric(q, { no_symbols: true })) {
        options.where[Op.or].id = q;
      }
    }
    // type
    if (req.query.type) {
      options.where.type = req.query.type;
    }
    // userResponseId
    if (req.query.userResponseId) {
      options.where.userResponseId = req.query.userResponseId;
    }
    // needsReview
    if (req.query.needsReview) {
      options.where.needsReview = req.query.needsReview;
    }
    // query options
    const page = req.query.page || 1;
    Model.setLimitOffsetForPage(page, options);
    options.order = [
      ['createdAt', 'desc'],
      ['id', 'desc'],
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
  body('type').trim().isIn(CtrModelModule.common.TYPE_ALL),
  body('personName')
    .trim()
    .isLength({
      min: 1,
      max: 90,
    })
    .not()
    .isEmpty(),
  body('personEmail').optional().trim(),
  body('personPhone').optional().trim(), // TODO validate phone
  body('subject')
    .trim()
    .isLength({
      min: 1,
      max: 90,
    })
    .not()
    .isEmpty(),
  body('message')
    .trim()
    .isLength({
      min: 1,
      max: 5000,
    })
    .not()
    .isEmpty(),
  body('response').optional().trim().isLength({
    min: 0,
    max: 5000,
  }),
  body('responseDateTime')
    .optional()
    .custom(helperValidator.isDate8601Func(true)),
  body('internalNotes').optional().trim().isLength({
    min: 0,
    max: 5000,
  }),
  body('userCreatedId')
    .optional({ checkFalsy: true })
    .isInt()
    .custom(customFindByPkRelationValidation(UserModel)),
  body('userResponseId')
    .optional({ checkFalsy: true })
    .isInt()
    .custom(customFindByPkRelationValidation(UserModel)),
  body('needsReview').optional().isBoolean(),
  // validationEndFunction, // dont need here, is attached below
];

const saveEntityFunc = async (req, res, next, id) => {
  try {
    const body = req.body;
    let entity = null;
    if (id) {
      entity = req.entity;
    } else {
      entity = Model.build({
        userCreatedId: body.userCreatedId ? body.userCreatedId : req.user.id,
        remoteIp: req.connection.remoteAddress,
      });
    }
    // fields
    entity.type = body.type;
    entity.personName = body.personName;
    entity.personEmail = body.personEmail;
    entity.personPhone = body.personPhone;
    entity.subject = body.subject;
    entity.message = body.message;
    entity.response = body.response;
    entity.responseDateTime = body.responseDateTime;
    entity.internalNotes = body.internalNotes;
    entity.userResponseId = body.userResponseId;
    entity.needsReview = body.needsReview;
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

/**
 * Post contact from non logged users
 */
exports.postPublicContactValidate = [
  body('type').trim().isIn(CtrModelModule.common.TYPE_ALL),
  body('personName')
    .trim()
    .isLength({
      min: 1,
      max: 90,
    })
    .not()
    .isEmpty(),
  body('personEmail')
    .trim()
    .isLength({
      min: 1,
      max: 90,
    })
    .isEmail()
    .not()
    .isEmpty(),
  body('personPhone')
    .trim()
    .isLength({
      min: 1,
      max: 90,
    })
    .not()
    .isEmpty(), // TODO validate phone
  body('subject')
    .trim()
    .isLength({
      min: 1,
      max: 90,
    })
    .not()
    .isEmpty(),
  body('message')
    .trim()
    .isLength({
      min: 1,
      max: 5000,
    })
    .not()
    .isEmpty(),
  validationEndFunction,
];

exports.postPublicContact = async (req, res, next) => {
  try {
    // recaptcha
    if (nconf.get('GOOGLE_RECAPTCHA_ENABLED', false)) {
      if (!(await helperValidator.recaptchaCheck(req.body.recaptchaToken))) {
        res.sendJsonServerError(
          'Erro ao validar recaptcha. Por favor tente novamente!'
        );
        return;
      }
    } else {
      throw new ApiError('Este formulário só funciona com RECAPTCHA ativo.');
    }
    const body = req.body;
    let entity = Model.build({
      remoteIp: req.connection.remoteAddress,
    });
    // fields
    entity.type = body.type;
    entity.personName = body.personName;
    entity.personEmail = body.personEmail;
    entity.personPhone = body.personPhone;
    entity.subject = body.subject;
    entity.message = body.message;
    entity.userResponseId = body.userResponseId;
    entity.needsReview = true;

    // send email
    const mail = new FormContactMail(entity, false);
    await mail.send(req, res, next);

    // save
    await entity.save();
    // send result
    const result = {
      entity: {
        id: entity.id,
      },
    };
    // correct http
    res.sendJsonOK(result);
  } catch (err) {
    next(err);
  }
};

/**
 * send response
 */
exports.postSendResponseValidate = [
  param('id').isInt().custom(customFindByPkValidation(Model)),
  body('response')
    .trim()
    .isLength({
      min: 1,
      max: 5000,
    })
    .not()
    .isEmpty(),
  body('internalNotes').optional().trim(),
  validationEndFunction,
];

exports.postSendResponse = async (req, res, next) => {
  try {
    // sets
    const body = req.body;
    const entity = req.entity;
    // fields
    entity.response = body.response;
    entity.internalNotes = body.internalNotes;
    entity.userResponseId = req.user.id;
    entity.responseDateTime = new Date();
    entity.needsReview = false;

    // send email
    const mail = new FormContactMail(entity, true);
    await mail.send(req, res, next);

    // save
    await entity.save();
    // send result
    const result = {
      entity: {
        id: entity.id,
      },
    };
    // correct http
    res.sendJsonOK(result);
  } catch (err) {
    next(err);
  }
};
