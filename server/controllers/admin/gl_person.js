const { body, query, param } = require("express-validator/check");
const validator = require("validator");
const { Op } = require("sequelize");

const {
  customFindByPkValidation,
  customFindByPkRelationValidation,
  validationEndFunction,
  BadRequestError,
  ApiError,
  NotFoundError,
} = require("../../middlewares/error-mid");
const CtrModelModule = require("../../models/gl_person");
const Model = CtrModelModule.model;
const CityModelModule = require("../../models/gl_city");
const CityModel = CityModelModule.model;
const PersonFieldModelModule = require("../../models/gl_person_field");
const PersonFieldModel = PersonFieldModelModule.model;
const FieldModelModule = require("../../models/gl_field");
const FieldModel = FieldModelModule.model;
const FieldItemModelModule = require("../../models/gl_field_item");
const FieldItemModel = FieldItemModelModule.model;

const helperValidator = require("../../helpers/validator");

const controllerDefaultQueryScope = "admin";

/**
 * List Validation
 */
exports.getIndexValidate = [
  query("page").optional().isInt(),
  query("q").optional().isString(),
  query("cityId").optional().isInt(),
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
        shortname: {
          [Op.iLike]: `${q}%`,
        },
        legalIdentifierCode: {
          [Op.iLike]: `${q}%`,
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
    options.order = [
      ["name", "asc"],
      ["id", "asc"],
    ];
    options.include = ["city"];
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
  param("id")
    .isInt()
    .not()
    .isEmpty()
    .custom(customFindByPkValidation(Model, null, { include: ["city"] })),
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
      fieldList: await PersonFieldModelModule.jsonSerializer(
        PersonFieldModelModule.findAllOrCreateByPerson(entity.id),
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
  param("id").optional().isInt(),
  body("legalType").isIn(CtrModelModule.LEGAL_TYPE_ALL),
  body("legalIdentifierType").isIn(CtrModelModule.LEGAL_IDENTIFIER_TYPE_ALL),
  body("legalIdentifierCode").custom(async (value, { req }) => {
    switch (req.body.legalIdentifierType) {
      case CtrModelModule.LEGAL_IDENTIFIER_TYPE_BR_CPF:
        if (!helperValidator.isCPF_Num(value)) {
          throw new ApiError("CPF inválido.");
        }
        break;

      case CtrModelModule.LEGAL_IDENTIFIER_TYPE_BR_CNPJ:
        if (!helperValidator.isCNPJ_Num(value)) {
          throw new ApiError("CNPJ inválido.");
        }
        break;

      case CtrModelModule.LEGAL_IDENTIFIER_TYPE_BR_OTHER:
        return true;

      default:
        throw new ApiError("Unknow Legal Identifier Type.");
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
              },
            },
          });
        } else {
          // new
          count = await Model.count({
            where: {
              legalIdentifierCode: value,
              legalIdentifierType: req.body.legalIdentifierType,
            },
          });
        }
        if (count > 0) {
          throw new Error(`Já existe um registro com este CPF/CNPJ: ${value}`);
        }
        break;
    }
    return true;
  }),
  body("name").isString().trim().not().isEmpty().isLength({
    min: 1,
    max: 90,
  }),
  body("shortname").optional().trim().isLength({
    max: 90,
  }),
  body("phone")
    .optional()
    .isLength({
      max: 90,
    })
    .custom((value) => {
      // TODO phone validator
      return true;
    }),
  body("cellphone")
    .optional()
    .trim()
    .isLength({
      max: 90,
    })
    .custom((value) => {
      // TODO phone validator
      return true;
    }),
  body("address").optional().trim().isLength({
    max: 90,
  }),
  body("email").optional({ checkFalsy: true }).isEmail(),
  body("addressZipcode").optional().trim().isLength({
    max: 60,
  }),
  body("addressNumber").optional().trim().isLength({
    max: 60,
  }),
  body("addressExtra").optional().trim().isLength({
    max: 60,
  }),
  body("addressNeighborhood").optional().trim().isLength({
    max: 60,
  }),
  body("cityId").isInt().custom(customFindByPkRelationValidation(CityModel)),
  body("birthdate").optional().custom(helperValidator.isDate8601Func(true)),
  body("latitude").optional().isNumeric(),
  body("longitude").optional().isNumeric(),
  body("obs").optional().trim().isLength({
    max: 5000,
  }),
  body("fields.*.id").isInt(),
  body("fields.*.fieldItemId").optional({ checkFalsy: true }).isInt(),
  body("fields.*")
    .optional()
    .custom(async (value, { req }) => {
      if (req.body.id) {
        value.personField = await PersonFieldModel.findOne({
          where: {
            personId: req.body.id,
            id: value.id,
          },
          include: ["field"],
        });
        if (!value.personField) {
          throw new ApiError("Campo não pertence à esta pessoa.");
        }
        if (value.fieldItemId) {
          const fieldItem = await FieldItemModel.findByPk(value.fieldItemId, {
            include: ["field"],
          });
          if (!fieldItem) {
            throw new ApiError("Item não pertence à este cadastro.");
          }
          if (
            fieldItem.field.destination !=
            FieldModelModule.DESTINATION_GL_PERSON
          ) {
            throw new ApiError("Campo Item não pertence à este cadastro.");
          }
          value.fieldItem = fieldItem;
        }
      }
      return true;
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
    // fields
    await Promise.all(
      body.fields.map(async (personFieldBody) => {
        const personField = personFieldBody.personField;
        switch (parseInt(personField.field.type)) {
          case FieldModelModule.TYPE_STRING:
            personField.valueString = personFieldBody.value
              ? `${personFieldBody.value}`
              : "";
            personField.valueSearch = personFieldBody.value
              ? `${personFieldBody.value}`
              : null;
            break;

          case FieldModelModule.TYPE_INT:
            personField.valueInt = personFieldBody.value
              ? parseInt(personFieldBody.value)
              : 0;
            personField.valueSearch = personFieldBody.value
              ? `${personFieldBody.value}`
              : null;
            break;

          case FieldModelModule.TYPE_DOUBLE:
            personField.valueDouble = personFieldBody.value
              ? parseFloat(personFieldBody.value)
              : 0;
            personField.valueSearch = personFieldBody.value
              ? `${personFieldBody.value}`
              : null;
            break;

          case FieldModelModule.TYPE_BOOLEAN:
            personField.valueBoolean = !!personFieldBody.value;
            personField.valueSearch = `${!!personFieldBody.value}`;
            break;

          case FieldModelModule.TYPE_SELECT:
            if (personFieldBody.fieldItemId) {
              personField.fieldItemId = personFieldBody.fieldItemId;
              personField.valueSearch = personFieldBody.fieldItem.value;
            } else {
              personField.fieldItemId = null;
              personField.valueSearch = null;
            }
            break;
        }
        await personField.save();
      })
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
  param("id").isInt().custom(customFindByPkValidation(Model)),
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
  param("id").isInt().custom(customFindByPkValidation(Model)),
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
