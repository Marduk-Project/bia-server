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
const GL_CityModule = require('../../models/gl_city');
const GL_CityModel = GL_CityModule.model;
const GL_StateModule = require('../../models/gl_state');
const GL_StateModel = GL_StateModule.model;
// const GL_CityStateRegionModule = require('../../models/gl_city_state_region');
// const GL_CityStateRegionModel = GL_CityStateRegionModule.model;

const controllerDefaultQueryScope = 'admin';

/**
 * List Index
 */
exports.getIndex = async (req, res, next) => {
  try {
    const options = {
      include: [
        {
          model: GL_ProductModel,
          as: 'glProduct',
        },
        {
          model: GL_UnitModel,
          as: 'glUnit',
        },
        {
          model: GL_PersonModel,
          as: 'glPersonDestination',
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
      ],
      order: [['id', 'asc']],
    };

    // exec
    const queryResult = await Model.findAndCountAll(options);

    const fields = {
      Origem: 'Sistema',
      Hospital: row => _.get(row, 'glPersonDestination.name'),
      Item: row => _.get(row, 'glProduct.name'),
      Tipo: row =>
        _.get(row, 'glProduct.consumable') ? 'CONSUMÍVEL' : 'EQUIPAMENTO',
      Descrição: row => '',
      Quantidade: row => _.get(row, 'requestQuantity'),
      Tamanho: row => 0,
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
      'Região - DRE': row => _.get(row, 'dasdsadas'),
      Microrregião: row => _.get(row, 'dasdsadas'),
      Mesorregião: row => _.get(row, 'dasdsadas'),
      'Prioridade COVID19': row =>
        _.get(row, 'glPersonDestination.personType.priority') > 0 ? 1 : 0,
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

    res.render('admin/or_orders_consolidated.ejs', {
      fields: Object.keys(fields),
      values: Object.values(fields),
      rows: queryResult.rows,
    });
  } catch (err) {
    next(err);
  }
};
