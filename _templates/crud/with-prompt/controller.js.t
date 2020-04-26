---
to: "<%= make.controller ? (inTestMode ? '_templates_compiled/tst_controller.js' : `server/controllers/${crud_context}/${name}.js`) : null %>"
---
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
const CtrModelModule = require('../../models/<%= name %>');
const Model = CtrModelModule.model;
<% if (crud_parentName) { -%>
const ParentModelModule = require('../../models/<%= crud_parentName %>');
const ParentModel = ParentModelModule.model;
<% } -%>
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName && !field.isParentId) { -%>
const <%= field.camelNameUpperNoId %>Module = require('../../models/<%= field.modelName %>');
const <%= field.modelCamelName %> = <%= field.camelNameUpperNoId %>Module.model;
<% } -%>
<% }); -%>

// const utils = require('../../helpers/utils');
const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = '<%= crud_context %>';

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
<% if (crud_parentName) { -%>
  query('<%= crud_parentFieldName %>').optional().isInt(),
<% } -%>
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
        // TODO other text query fields here
      };
      if (validator.isNumeric(q, { no_symbols: true })) {
        options.where[Op.or].id = q;
      }
    }
<% if (crud_parentName) { -%>
    // <%= crud_parentFieldName %>
    options.where.<%= crud_parentFieldName %> = req.query.<%= crud_parentFieldName %>;
<% } -%>
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
      data: await CtrModelModule.jsonSerializer(queryResult.rows, controllerDefaultQueryScope),
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
    .custom(customFindByPkValidation(Model)),
  validationEndFunction,
];

/**
 * Get for Edit
 */
exports.getEdit = async (req, res, next) => {
  try {
    const entity = req.entity;
    res.sendJsonOK({
      data: await CtrModelModule.jsonSerializer(entity, controllerDefaultQueryScope),
    });
  } catch (err) {
    next(err);
  }
}



/**
 * Save validation
 */
const saveValidate = [
  param('id').optional().isInt(),
<% crud_fieldObjects.forEach(function(field) { -%>
  body('<%= field.name %>')
<% if (field.type == 'string') { -%>
<% if (field.required) { -%>
    .trim()
    .not().isEmpty()
    .isLength({
      min: 1,
      max: 60,
    }),
<% } else { -%>
    .optional()
    .trim(),
<% } -%>
<% } -%>
<% if (field.type == 'int') { -%>
<% if (field.modelName) { -%>
    .isInt()
    .custom(customFindByPkRelationValidation(<%= field.isParentId ? 'ParentModel' : field.modelCamelName %>)),
<% } else { -%>
<% if (field.required) { -%>
    .isInt(),
<% } else { -%>
    .optional()
    .isInt(),
<% } -%>
<% } -%>
<% } -%>
<% if (field.type == 'double') { -%>
<% if (field.required) { -%>
    .isNumeric(),
<% } else { -%>
    .optional()
    .isNumeric(),
<% } -%>
<% } -%>
<% if (field.type == 'boolean') { -%>
<% if (field.required) { -%>
    .isBoolean(),
<% } else { -%>
    .optional()
    .isBoolean(),
<% } -%>
<% } -%>
<% if (field.type == 'datetime') { -%>
<% if (field.required) { -%>
    .not().isEmpty()
    .custom(helperValidator.isDate8601Func(true)),
<% } else { -%>
    .optional()
    .custom(helperValidator.isDate8601Func(true)),
<% } -%>
<% } -%>
<% }); -%>
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
<% crud_fieldObjects.forEach(function(field) { -%>
    entity.<%= field.name %> = body.<%= field.name %>;
<% }); -%>
    // save
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
    .custom(customFindByPkValidation(Model)),
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
    .custom(customFindByPkValidation(Model)),
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
      data: await CtrModelModule.jsonSerializer(entity, controllerDefaultQueryScope),
    });
  } catch (err) {
    next(err);
  }
}
