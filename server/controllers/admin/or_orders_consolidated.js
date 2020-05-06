const { body, query, param } = require('express-validator/check');
const validator = require('validator');
const { Op } = require('sequelize');

const ejs = require('ejs');

const {
  customFindByPkValidation,
  customFindByPkRelationValidation,
  validationEndFunction,
  BadRequestError,
  ApiError,
  NotFoundError,
} = require('../../middlewares/error-mid');
// const CtrModelModule = require('../../models/or_order_consolidated');
// const Model = CtrModelModule.model;
// const GL_ProductModule = require('../../models/gl_product');
// const GL_ProductModel = GL_ProductModule.model;
// const GL_UnitModule = require('../../models/gl_unit');
// const GL_UnitModel = GL_UnitModule.model;
// const GL_PersonModule = require('../../models/gl_person');
// const GL_PersonModel = GL_PersonModule.model;

// const utils = require('../../helpers/utils');
const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = 'admin';

/**
 * List Index
 */
exports.getIndex = async (req, res, next) => {
  try {
    //   const options = {
    //     where: {},
    //   };
    //   // q
    //   if (req.query.q) {
    //     const q = req.query.q;
    //     options.where[Op.or] = {
    //       name: {
    //         [Op.like]: `${q}%`,
    //       },
    //       // TODO other text query fields here
    //     };
    //     if (validator.isNumeric(q, { no_symbols: true })) {
    //       options.where[Op.or].id = q;
    //     }
    //   }
    //   // query options
    //   const page = req.query.page || 1;
    //   Model.setLimitOffsetForPage(page, options);
    //   options.order = [
    //     // ['name', 'asc'], // TODO check order
    //     ['id', 'asc'],
    //   ];
    //   // exec
    //   const queryResult = await Model.findAndCountAll(options);
    //   const meta = Model.paginateMeta(queryResult, page);
    //   res.sendJsonOK({
    //     data: await CtrModelModule.jsonSerializer(
    //       queryResult.rows,
    //       controllerDefaultQueryScope
    //     ),
    //     meta: meta,
    // });
    res.render('admin/or_orders_consolidated.ejs', {
      rows: [{ a: 1 }],
    });
  } catch (err) {
    next(err);
  }
};
