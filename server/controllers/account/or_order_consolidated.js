const { body, query, param } = require('express-validator/check');
const validator = require('validator');
const { Op } = require('sequelize');
const _ = require('lodash');

const {
  customFindByPkValidation,
  customFindByPkRelationValidation,
  validationEndFunction,
  BadRequestError,
  ApiError,
  NotFoundError,
} = require('../../middlewares/error-mid');
const CtrModelModule = require('../../models/or_order_consolidated');
const Model = CtrModelModule.model;
const GL_ProductModule = require('../../models/gl_product');
const GL_ProductModel = GL_ProductModule.model;
const GL_UnitModule = require('../../models/gl_unit');
const GL_UnitModel = GL_UnitModule.model;
const GL_PersonModule = require('../../models/gl_person');
const GL_PersonModel = GL_PersonModule.model;
const GL_PersonTypeModule = require('../../models/gl_person_type');
const GL_PersonTypeModel = GL_PersonTypeModule.model;
const GL_PersonContactModelModule = require('../../models/gl_person_contact');
const GL_PersonContactModel = GL_PersonContactModelModule.model;
const GL_CityModule = require('../../models/gl_city');
const GL_CityModel = GL_CityModule.model;
const GL_StateModule = require('../../models/gl_state');
const GL_StateModel = GL_StateModule.model;
// const GL_CityStateRegionModule = require('../../models/gl_city_state_region');
// const GL_CityStateRegionModel = GL_CityStateRegionModule.model;

const controllerDefaultQueryScope = 'account';

/**
 * List Validation
 */
exports.getValuesValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
  query('glPersonDestinationId').optional().isInt(),
  validationEndFunction,
];

/**
 * List Index
 */
const getQueryOptions = async (query, userId, userIsStaff) => {
  const options = {
    where: {},
  };
  // user staff can filter
  if (userIsStaff) {
    // glPersonDestinationId
    if (query.glPersonDestinationId) {
      options.where.glPersonDestinationId = query.glPersonDestinationId;
    }
  } else {
    // normal user
    // query only allowed person contact ids
    const allowedPersonIdList = await GL_PersonContactModel.allowdPersonIdListForUser(
      userId
    );
    options.where.glPersonDestinationId = {
      [Op.in]: allowedPersonIdList,
    };
    if (query.glPersonDestinationId) {
      options.where.glPersonDestinationId[Op.eq] = query.glPersonDestinationId;
    }
  }
  // query options
  options.order = [['id', 'desc']];
  options.include = [
    {
      association: 'glProduct',
      where: query.q
        ? {
            name: {
              [Op.like]: `${query.q}%`,
            },
          }
        : undefined,
    },
    {
      association: 'glUnit',
    },
    {
      association: 'glPersonDestination',
      include: [
        {
          model: GL_CityModel,
          as: 'city',
          include: [
            {
              model: GL_StateModel,
              as: 'state',
            },
          ],
        },
        {
          model: GL_PersonTypeModel,
          as: 'personType',
        },
      ],
    },
  ];
  return options;
};

exports.getIndex = async (req, res, next) => {
  try {
    // query options
    const options = await getQueryOptions(
      req.query,
      req.user.id,
      req.user.levelIsStaff
    );
    const page = req.query.page || 1;
    Model.setLimitOffsetForPage(page, options);
    options.order = [
      ['createdAt', 'desc'],
      ['id', 'desc'],
    ];
    // exec
    const queryResult = await Model.findAndCountAll(options);
    queryResult.rows = queryResult.rows.filter(row => {
      if (row.requestQuantity != 0) {
        return true;
      }
      if (row.supplyReserveQuantity != 0) {
        return true;
      }
      if (row.supplyTransportQuantity != 0) {
        return true;
      }
      return false;
    });
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

exports.getExport = async (req, res, next) => {
  try {
    const options = await getQueryOptions(
      req.query,
      req.user.id,
      req.user.levelIsStaff
    );
    const queryResult = await Model.findAndCountAll(options);
    let rows = await CtrModelModule.jsonSerializer(
      queryResult.rows,
      controllerDefaultQueryScope
    );
    // exec
    rows = rows.filter(row => row.requestQuantity != 0);

    const fields = {
      Origem: 'Sistema',
      Hospital: row =>
        `${_.get(row, 'glPersonDestination.name')} - ${_.get(
          row,
          'glPersonDestination.city.name'
        )}`,
      Item: row => _.get(row, 'glProduct.name'),
      Tipo: row =>
        _.get(row, 'glProduct.consumable') ? 'INSUMOS' : 'EQUIPAMENTO',
      Descrição: row => '',
      Quantidade: row => _.get(row, 'requestQuantity'),
      Tamanho: row => '',
      Necessidade: row => '',
      'necessidade 30 dias': row => '',
      URGÊNCIA_CLASSIF: row => '',
      Unidade: row => _.get(row, 'glUnit.name'),
      'Prioridade do Item': row => '',
      Cidade: row => _.get(row, 'glPersonDestination.city.name'),
      'Tipo Solicitante': row =>
        _.get(row, 'glPersonDestination.personType.name'),
      'Grau Prioridade COVID': row =>
        _.get(row, 'glPersonDestination.priority'),
      'Região - DRE': row =>
        _.get(row, 'glPersonDestination.city.macroRegion.name'),
      Microrregião: row =>
        _.get(row, 'glPersonDestination.city.microRegion.name'),
      Mesorregião: row =>
        _.get(row, 'glPersonDestination.city.mesoRegion.name'),
      'Prioridade COVID19': row =>
        _.get(row, 'glPersonDestination.personType.priority') > 0
          ? 'SIM'
          : 'NÃO',
      'Solicitação Original': row => '',
      'Correção de demanda': row => '',
      'Correção Doações': row => '',
      'Doações entregues': row => '',
      PÁGINA: row => '',
      Urgência: row => '',
      Chave: row => '',
      'Quantidade Corrigida': row => '',
      Gerência_Distrital_POA: row => '',
      Gestão_POA: row => '',
    };

    res.render('admin/or_order_consolidated.ejs', {
      fields: Object.keys(fields),
      values: Object.values(fields),
      rows: rows,
    });
  } catch (err) {
    next(err);
  }
};
