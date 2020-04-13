const { body, query, param } = require('express-validator/check');
const validator = require('validator');
const { Op } = require('sequelize');

const {
  customFindByPkValidation,
  customFindByPkRelationValidation,
  validationEndFunction,
  BadRequestError,
  ApiError,
  NotFoundError
} = require('../../middlewares/error-mid');
const CtrModelModule = require('../../models/gl_person');
const Model = CtrModelModule.model;
const CityModelModule = require('../../models/gl_city');
const CityModel = CityModelModule.model;

const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = null;

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
  query('cityId').optional().isInt(),
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
          [Op.iLike]: `%${q}%`,
        },
        shortname: {
          [Op.iLike]: `%${q}%`,
        },
        legalIdentifierCode: {
          [Op.iLike]: `%${q}%`,
        },
      };
      if (validator.isNumeric(q, { no_symbols: true })) {
        options.where[Op.or].id = q;
      }
    }
    // cityId
    if (req.query.cityId) {
      options.where.cityId = req.query.cityId;
    }
    // query options
    const page = req.query.page || 1;
    Model.setLimitOffsetForPage(page, options);
    options.order - [
      ['name', 'asc'],
      ['id', 'asc'],
    ];
    options.include = ['city'];
    // exec
    const queryResult = controllerDefaultQueryScope ?
      await Model
        .scope(controllerDefaultQueryScope)
        .findAndCountAll(options) :
      await Model
        .findAndCountAll(options)
    const meta = Model.paginateMeta(queryResult, page);
    res.sendJsonOK({
      data: queryResult.rows,
      meta: meta,
    });
  } catch (err) {
    next(err);
  }
}


/**
 * Get for Edit Validate
 */
exports.getEditValidate = [
  param('id')
    .isInt()
    .not().isEmpty()
    .custom(customFindByPkValidation(Model, controllerDefaultQueryScope, { include: ['city'] })),
  validationEndFunction,
];

/**
 * Get for Edit
 */
exports.getEdit = async (req, res, next) => {
  try {
    const entity = req.entity;
    res.sendJsonOK({
      data: entity
    });
  } catch (err) {
    next(err);
  }
}



/**
 * Save validation
 */
const saveValidate = [
  param('id')
    .optional()
    .isInt(),
  body('legalType')
    .isIn(CtrModelModule.LEGAL_TYPE_ALL),
  body('legalIdentifierType')
    .isString()
    .isIn(CtrModelModule.LEGAL_IDENTIFIER_TYPE_ALL),
  body('legalIdentifierCode')
    .isString()
    .custom(async (value, { req }) => {
      switch (req.body.legalIdentifierType) {
        case CtrModelModule.LEGAL_IDENTIFIER_TYPE_BR_CPF:
          if (!helperValidator.isCPF_Num(value)) {
            throw new ApiError('CPF inválido.');
          }
          break;

        case CtrModelModule.LEGAL_IDENTIFIER_TYPE_BR_CNPJ:
          if (!helperValidator.isCNPJ_Num(value)) {
            throw new ApiError('CNPJ inválido.');
          }
          break;

        case CtrModelModule.LEGAL_IDENTIFIER_TYPE_BR_OTHER:
          return true;

        default:
          throw new ApiError('Unknow Legal Identifier Type.');
      }
      let count = 0;
      // check for duplicated
      switch (req.body.legalIdentifierType) {
        case CtrModelModule.LEGAL_IDENTIFIER_TYPE_BR_CPF:
        case CtrModelModule.LEGAL_IDENTIFIER_TYPE_BR_CNPJ:
          if (req.params.id) {
            // already exists
            count = await Model.count({
              where: {
                legalIdentifierCode: value,
                legalIdentifierType: req.body.legalIdentifierType,
                id: {
                  [Op.ne]: req.params.id,
                }
              }
            });
          } else {
            // new
            count = await Model.count({
              where: {
                legalIdentifierCode: value,
                legalIdentifierType: req.body.legalIdentifierType,
              }
            });
          }
          if (count > 0) {
            throw new Error(`Já existe um registro com este CPF/CNPJ: ${value}`);
          }
          break;
      }
      return true;
    }),
  body('name')
    .isString()
    .trim()
    .not().isEmpty()
    .isLength({
      min: 1,
      max: 90,
    }),
  body('shortname')
    .optional()
    .trim()
    .isLength({
      max: 90,
    }),
  body('phone')
    .optional()
    .isLength({
      max: 90,
    })
    .custom(value => {
      // TODO phone validator
      return true;
    }),
  body('cellphone')
    .optional()
    .trim()
    .isLength({
      max: 90,
    })
    .custom(value => {
      // TODO phone validator
      return true;
    }),
  body('address')
    .optional()
    .trim()
    .isLength({
      max: 90,
    }),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail(),
  body('addressZipcode')
    .optional()
    .trim()
    .isLength({
      max: 60,
    }),
  body('addressNumber')
    .optional()
    .trim()
    .isLength({
      max: 60,
    }),
  body('addressExtra')
    .optional()
    .trim()
    .isLength({
      max: 60,
    }),
  body('addressNeighborhood')
    .optional()
    .trim()
    .isLength({
      max: 60,
    }),
  body('cityId')
    .isInt()
    .custom(customFindByPkRelationValidation(CityModel, null, controllerDefaultQueryScope)),
  body('birthdate')
    .optional()
    .custom(helperValidator.isDate8601Func(true)),
  body('latitude')
    .optional()
    .isNumeric(),
  body('longitude')
    .optional()
    .isNumeric(),
  body('obs')
    .optional()
    .trim()
    .isLength({
      max: 5000,
    }),
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
    entity.legalType = body.legalType;
    entity.legalIdentifierType = body.legalIdentifierType;
    entity.legalIdentifierCode = body.legalIdentifierCode;
    entity.name = body.name;
    entity.shortname = body.shortname;
    entity.phone = body.phone;
    entity.cellphone = body.cellphone;
    entity.email = body.email;
    entity.address = body.address;
    entity.addressZipcode = body.addressZipcode;
    entity.addressNumber = body.addressNumber;
    entity.addressExtra = body.addressExtra;
    entity.addressNeighborhood = body.addressNeighborhood;
    entity.cityId = body.cityId;
    entity.birthdate = body.birthdate;
    entity.latitude = body.latitude;
    entity.longitude = body.longitude; // TODO implement
    entity.obs = body.obs;
    await entity.save();
    // send result
    const result = {
      entity: {
        id: entity.id
      }
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
}




/** Update validation */
exports.putUpdateValidate = [
  ...saveValidate,
  param('id')
    .isInt()
    .custom(customFindByPkValidation(Model, controllerDefaultQueryScope)),
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
}




/**
 * Create validation
 */
exports.postCreateValidate = [
  ...saveValidate,
  validationEndFunction,
];

/**
 * Create
 */
exports.postCreate = async (req, res, next) => {
  try {
    await saveEntityFunc(req, res, next);
  } catch (err) {
    next(err);
  }
}




/**
 * Delete Validate
 */
exports.deleteValidate = [
  param('id')
    .isInt()
    .custom(customFindByPkValidation(Model, controllerDefaultQueryScope)),
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
      data: entity,
    });
  } catch (err) {
    next(err);
  }
}
