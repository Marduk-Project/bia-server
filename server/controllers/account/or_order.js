const { body, query, param } = require('express-validator/check');
const validator = require('validator');
const { Op } = require('sequelize');
const { mainDb } = require('../../database/main_connection');

const {
  customFindByPkValidation,
  customFindByPkRelationValidation,
  validationEndFunction,
  BadRequestError,
  ApiError,
  NotFoundError,
} = require('../../middlewares/error-mid');

const CONSTANTS = require('../../../common/constants');

const CtrModelModule = require('../../models/or_order');
const Model = CtrModelModule.model;
const ModelCommon = CtrModelModule.common;
const OrderProductModelModule = require('../../models/or_order_product');
const OrderProductModel = OrderProductModelModule.model;
const OrderHistoryModelModule = require('../../models/or_order_history');
const OrderHistoryModel = OrderHistoryModelModule.model;
const OrderConsolidatedModelModule = require('../../models/or_order_consolidated');
const OrderConsolidatedModel = OrderConsolidatedModelModule.model;
const GL_UserModule = require('../../models/gl_user');
const GL_UserModel = GL_UserModule.model;
const GL_PersonModule = require('../../models/gl_person');
const GL_PersonModel = GL_PersonModule.model;
const GL_PersonContactModule = require('../../models/gl_person_contact');
const GL_PersonContactModel = GL_PersonContactModule.model;
const GL_ProductModelModule = require('../../models/gl_product');
const GL_ProductModel = GL_ProductModelModule.model;

// const utils = require('../../helpers/utils');
const helperValidator = require('../../helpers/validator');

const controllerDefaultQueryScope = 'account';
const includeDefaultOption = [
  'glUser',
  'glPersonOrigin',
  'glPersonContactOrigin',
  'glPersonDestination',
  'glPersonContactDestination',
];

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
  query('glPersonDestinationId').optional().isInt(),
  query('glPersonOriginId').optional().isInt(),
  query('status').optional().isIn(CtrModelModule.common.STATUS_ALL),
  query('type').optional().isIn(CtrModelModule.common.TYPE_ALL),
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
      if (validator.isNumeric(q, { no_symbols: true })) {
        options.where[Op.or] = {
          id: q,
        };
        if (req.user.levelIsStaff) {
          options.where[Op.or].glPersonDestinationId = q;
          options.where[Op.or].glPersonContactDestinationId = q;
          options.where[Op.or].glPersonOriginId = q;
          options.where[Op.or].glPersonContactOriginId = q;
        }
      }
    }
    // user staff can filter
    if (req.user.levelIsStaff) {
      // glPersonDestinationId
      if (req.query.glPersonDestinationId) {
        options.where.glPersonDestinationId = req.query.glPersonDestinationId;
      }
      // glPersonOriginId
      if (req.query.glPersonOriginId) {
        options.where.glPersonOriginId = req.query.glPersonOriginId;
      }
    } else {
      // normal user
      // query only allowed person contact ids
      const allowedPersonIdList = await GL_PersonContactModel.allowdPersonIdListForUser(
        req.user.id
      );
      options.where.glPersonDestinationId = {
        [Op.in]: allowedPersonIdList,
      };
      options.where.glPersonOriginId = {
        [Op.in]: allowedPersonIdList,
      };
    }
    // status
    if (req.query.status) {
      options.where.status = req.query.status;
    }
    // type
    if (req.query.type) {
      options.where.type = req.query.type;
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
        req.user.levelIsStaff ? 'admin' : controllerDefaultQueryScope
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
      customFindByPkValidation(Model, null, {
        include: [
          ...includeDefaultOption,
          {
            association: 'glProducts',
            include: [
              {
                association: 'glProduct',
                include: ['unit'],
              },
              {
                association: 'glUnit',
              },
            ],
          },
        ],
      })
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
        req.user.levelIsStaff ? 'admin' : controllerDefaultQueryScope
      ),
    });
  } catch (err) {
    next(err);
  }
};

const customPersonValidation = async (value, { req }) => {
  if (req.user.levelIsStaff) {
    return true;
  }
  const contact = await GL_PersonContactModel.findOne({
    where: {
      userId: req.user.id,
      personId: value,
    },
  });
  if (!contact) {
    throw new ApiError('Usuário não possui relação com a entidade.');
  }
  if (!contact.canEditOrder) {
    throw new ApiError(
      'Usuário não possui autorização para enviar pedidos e entregas para esta entidade.'
    );
  }
  return true;
};

const customPersonContactValidation = (relBodyName, relPersonBodyName) => {
  return async (value, { req }) => {
    if (!req[relBodyName]) {
      return false;
    }
    if (!req[relPersonBodyName]) {
      return false;
    }
    if (req[relBodyName].personId != req[relPersonBodyName].id) {
      throw new ApiError('Contato não petence à entidade.');
    }
    return true;
  };
};

/**
 * Save validation
 */
const saveValidate = [
  param('id').optional().isInt(),
  body('type').isIn(CtrModelModule.common.TYPE_ALL),
  body('appContext').isIn(CONSTANTS.CONTEXT_ALL),
  body('glPersonOriginId')
    .isInt()
    .custom(
      customFindByPkRelationValidation(GL_PersonModel, 'entity_personOrigin')
    )
    .custom(customPersonValidation),
  body('glPersonContactOriginId')
    .isInt()
    .custom(
      customFindByPkRelationValidation(
        GL_PersonContactModel,
        'entity_personOriginContact'
      )
    )
    .custom(
      customPersonContactValidation(
        'entity_personOriginContact',
        'entity_personOrigin'
      )
    ),
  body('glPersonDestinationId')
    .isInt()
    .custom(
      customFindByPkRelationValidation(
        GL_PersonModel,
        'entity_personDestination'
      )
    )
    .custom(customPersonValidation),
  body('glPersonContactDestinationId')
    .isInt()
    .custom(
      customFindByPkRelationValidation(
        GL_PersonContactModel,
        'entity_personContactDestination'
      )
    )
    .custom(
      customPersonContactValidation(
        'entity_personContactDestination',
        'entity_personDestination'
      )
    ),
  body('notes').optional().trim(),
  body('internalNotes').optional().trim(),
  body('needsReview').optional().isBoolean(),
  body('status').custom((value, { req }) => {
    if (req.user.levelIsStaff) {
      return CtrModelModule.common.STATUS_ALL.includes(parseInt(value));
    }
    return [
      CtrModelModule.common.STATUS_NEW,
      CtrModelModule.common.STATUS_CANCELED,
    ].includes(parseInt(value));
  }),
  body('glProducts').isArray(),
  body('glProducts.*').custom(async (value, { req }) => {
    value.quantity = parseFloat(value.quantity);
    if (value.quantity <= 0) {
      throw new ApiError('Quantidade inválida.');
    }
    if (!value.glProductId) {
      return false;
    }
    value.product = await GL_ProductModel.findOne({
      where: { id: value.glProductId, requestFormActive: true },
    });
    if (!value.product) {
      throw new ApiError(
        'Produto não encontrado ou não disponível no formulário.'
      );
    }
    return true;
  }),
  // validationEndFunction, // dont need here, is attached below
];

const saveEntityFunc = async (req, res, next, id) => {
  let transaction = await mainDb.transaction();
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
    entity.glPersonOriginId = body.glPersonOriginId;
    entity.glPersonContactOriginId = body.glPersonContactOriginId;
    entity.glPersonDestinationId = body.glPersonDestinationId;
    entity.glPersonContactDestinationId = body.glPersonContactDestinationId;
    entity.notes = body.notes;
    entity.status = body.status;
    // TODO pensar em fazer job ou queue
    if (body.status == ModelCommon.STATUS_REVIEW_OK) {
      entity.status = ModelCommon.STATUS_PROCESSED;
    }
    if (!id) {
      entity.glUserId = req.user.id;
      entity.needsReview = !!body.notes;
    }
    if (req.user.levelIsStaff) {
      entity.internalNotes = body.internalNotes;
      entity.needsReview = body.needsReview;
    }
    // save
    if (id) {
      // history for update
      await OrderHistoryModel.checkAndCreateHistory(
        entity,
        req.user.id,
        false,
        { transaction: transaction }
      );
    }
    await entity.save({
      transaction: transaction,
    });
    // history for creation
    if (!id) {
      await OrderHistoryModel.checkAndCreateHistory(entity, req.user.id, true, {
        transaction: transaction,
      });
    }
    // check and save products
    const changedProductList = [];
    await Promise.all(
      body.glProducts.map(async item => {
        const itemEntity = await OrderProductModel.saveOrderProduct(
          {
            order: entity,
            product: item.product,
          },
          { quantity: item.quantity, notes: item.notes },
          {
            transaction: transaction,
          }
        );
        changedProductList.push(itemEntity.id);
      })
    );
    // === delete products without quantity
    // get the list for callback hooks to be called
    const orderProductsToRemove = await OrderProductModel.findAll({
      where: {
        orderId: entity.id,
        id: {
          [Op.notIn]: changedProductList,
        },
      },
    });
    // delete items
    await Promise.all(
      orderProductsToRemove.map(async item => {
        await item.destroy({ transaction: transaction });
      })
    );
    // transaction finish
    await transaction.commit();
    // consolidate
    transaction = await mainDb.transaction();
    await OrderConsolidatedModelModule.consolidateByPersonDestination(
      entity.glPersonDestinationId,
      { transaction: transaction }
    );
    // transaction finish
    await transaction.commit();
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
    await transaction.rollback();
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
