// const { body, query, param } = require('express-validator/check');
// const validator = require('validator');
// const { Op } = require('sequelize');

// const {
//   customFindByPkValidation,
//   customFindByPkRelationValidation,
//   validationEndFunction,
//   BadRequestError,
//   ApiError,
//   NotFoundError
// } = require('../../middlewares/error-mid');
// const CtrModelModule = require('../../models/gl_person_field');
// const Model = CtrModelModule.model;
// const ParentModelModule = require('../../models/gl_person');
// const ParentModel = ParentModelModule.model;
// const FieldModule = require('../../models/gl_field');
// const FieldModel = FieldModule.model;
// const FieldItemModule = require('../../models/gl_field_item');
// const FieldItemModel = FieldItemModule.model;

// // const utils = require('../../helpers/utils');
// const helperValidator = require('../../helpers/validator');

// const controllerDefaultQueryScope = 'admin';

// /**
//  * List Validation
//  */
// exports.getIndexValidate = [
//   query('page').optional().isInt(),
//   query('q').optional().isString(),
//   query('personId').optional().isInt(),
//   validationEndFunction,
// ];

// /**
//  * List Index
//  */
// exports.getIndex = async (req, res, next) => {
//   try {
//     const options = {
//       where: {},
//     };
//     // q
//     if (req.query.q) {
//       const q = req.query.q;
//       options.where[Op.or] = {
//         name: {
//           [Op.iLike]: `%${q}%`,
//         },
//         // TODO other text query fields here
//       };
//       if (validator.isNumeric(q, { no_symbols: true })) {
//         options.where[Op.or].id = q;
//       }
//     }
//     // personId
//     options.where.personId = req.query.personId;
//     // query options
//     const page = req.query.page || 1;
//     Model.setLimitOffsetForPage(page, options);
//     options.order = [
//       // ['name', 'asc'], // TODO check order
//       ['id', 'asc'],
//     ];
//     // exec
//     const queryResult = await Model.findAndCountAll(options);
//     const meta = Model.paginateMeta(queryResult, page);
//     res.sendJsonOK({
//       data: await CtrModelModule.jsonSerializer(queryResult.rows, controllerDefaultQueryScope),
//       meta: meta,
//     });
//   } catch (err) {
//     next(err);
//   }
// }


// /**
//  * Get for Edit Validate
//  */
// exports.getEditValidate = [
//   param('id')
//     .isInt()
//     .not().isEmpty()
//     .custom(customFindByPkValidation(Model)),
//   validationEndFunction,
// ];

// /**
//  * Get for Edit
//  */
// exports.getEdit = async (req, res, next) => {
//   try {
//     const entity = req.entity;
//     res.sendJsonOK({
//       data: await CtrModelModule.jsonSerializer(entity, controllerDefaultQueryScope),
//     });
//   } catch (err) {
//     next(err);
//   }
// }



// /**
//  * Save validation
//  */
// const saveValidate = [
//   param('id').optional().isInt(),
//   body('fieldId')
//     .isInt()
//     .custom(customFindByPkRelationValidation(FieldModel)),
//   body('fieldItemId')
//     .isInt()
//     .custom(customFindByPkRelationValidation(FieldItemModel)),
//   body('personId')
//     .isInt()
//     .custom(customFindByPkRelationValidation(ParentModel)),
//   body('valueString')
//     .optional()
//     .trim(),
//   body('valueInt')
//     .optional()
//     .isInt(),
//   body('valueDouble')
//     .optional()
//     .isNumeric(),
//   body('valueBoolean')
//     .optional()
//     .isBoolean(),
//   // validationEndFunction, // dont need here, is attached below
// ];

// const saveEntityFunc = async (req, res, next, id) => {
//   try {
//     const body = req.body;
//     let entity = null;
//     if (id) {
//       entity = req.entity;
//     } else {
//       entity = Model.build({});
//     }
//     // fields
//     entity.fieldId = body.fieldId;
//     entity.fieldItemId = body.fieldItemId;
//     entity.personId = body.personId;
//     entity.valueString = body.valueString;
//     entity.valueInt = body.valueInt;
//     entity.valueDouble = body.valueDouble;
//     entity.valueBoolean = body.valueBoolean;
//     // save
//     await entity.save();
//     // send result
//     const result = {
//       entity: {
//         id: entity.id
//       }
//     };
//     // correct http
//     if (id) {
//       res.sendJsonOK(result);
//     } else {
//       res.sendJsonCreatedOK(result);
//     }
//   } catch (err) {
//     next(err);
//   }
// }




// /** Update validation */
// exports.putUpdateValidate = [
//   ...saveValidate,
//   param('id')
//     .isInt()
//     .custom(customFindByPkValidation(Model)),
//   validationEndFunction,
// ];

// /**
//  * Update
//  */
// exports.putUpdate = async (req, res, next) => {
//   try {
//     await saveEntityFunc(req, res, next, req.params.id);
//   } catch (err) {
//     next(err);
//   }
// }




// /**
//  * Create validation
//  */
// exports.postCreateValidate = [
//   ...saveValidate,
//   validationEndFunction,
// ];

// /**
//  * Create
//  */
// exports.postCreate = async (req, res, next) => {
//   try {
//     await saveEntityFunc(req, res, next);
//   } catch (err) {
//     next(err);
//   }
// }




// /**
//  * Delete Validate
//  */
// exports.deleteValidate = [
//   param('id')
//     .isInt()
//     .custom(customFindByPkValidation(Model)),
//   validationEndFunction,
// ];

// /**
// * Delete
// */
// exports.delete = async (req, res, next) => {
//   try {
//     // const id = req.params.id;
//     const entity = req.entity;
//     await entity.destroy();
//     res.sendJsonOK({
//       data: await CtrModelModule.jsonSerializer(entity, controllerDefaultQueryScope),
//     });
//   } catch (err) {
//     next(err);
//   }
// }
