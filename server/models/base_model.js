const validator = require('validator');
const { Sequelize, Model } = require('sequelize');
const _ = require('lodash');
const util = require('util');

const PAGINATION_PER_PAGE = 100;
const { mainDb } = require('../database/main_connection');
const ApiError = require('../middlewares/error-mid').ApiError;

const sanitizePage = page => {
  if (typeof page != 'number') {
    try {
      page = parseInt(page || 1);
    } catch (err) {
      page = 1;
    }
  }
  return Math.max(page, 1);
};

/**
 * Alter query options to put limit and offset for page
 * @param {int} page
 * @param {object} [queryOptions=undefined]
 * @param {int} [itemsPerPage=constant]
 * @returns {object} queryOptions
 */
const setLimitOffsetForPage = (page, queryOptions, itemsPerPage) => {
  page = sanitizePage(page);
  if (!itemsPerPage) {
    itemsPerPage = PAGINATION_PER_PAGE;
  }
  if (!queryOptions) {
    queryOptions = { limit: 0, offset: 0 };
  }
  queryOptions.offset = (page - 1) * itemsPerPage;
  queryOptions.limit = itemsPerPage;
  return queryOptions;
};
exports.setLimitOffsetForPage = setLimitOffsetForPage;

/**
 * Creates the std pagination meta object
 * @param {object} queryResult
 * @param {int} queryResult.count total rows
 * @param {array} queryResult.rows rows interval array
 * @param {int} page current page
 * @param {int} [itemsPerPage=constant]
 * @returns {object} paginateMeta
 */
const paginateMeta = (queryResult, page, itemsPerPage) => {
  let totalCount = 0;
  if (queryResult) {
    totalCount = queryResult.count ? queryResult.count : 0;
  }
  page = sanitizePage(page);
  if (!itemsPerPage) {
    itemsPerPage = PAGINATION_PER_PAGE;
  }
  const toTmp = page * itemsPerPage;
  return {
    from: (page - 1) * itemsPerPage + 1,
    to: totalCount < toTmp ? totalCount : toTmp,
    total: totalCount,
    current_page: page,
    per_page: itemsPerPage,
    last_page: Math.ceil(totalCount / itemsPerPage),
  };
};
exports.paginateMeta = paginateMeta;

// TODO pagination / pagination meta
// id exists
// id exists func

exports.PAGINATION_PER_PAGE = PAGINATION_PER_PAGE;

class BaseModel extends Model {
  /**
   * Alter query options to put limit and offset for page
   * @param {int} page
   * @param {object} [queryOptions=undefined]
   * @param {int} [itemsPerPage=constant]
   * @returns {object} queryOptions
   */
  static setLimitOffsetForPage(page, queryOptions, itemsPerPage) {
    return setLimitOffsetForPage(page, queryOptions, itemsPerPage);
  }

  /**
   * Creates the std pagination meta object
   * @param {object} queryResult
   * @param {int} queryResult.count total rows
   * @param {array} queryResult.rows rows interval array
   * @param {int} page current page
   * @param {int} [itemsPerPage=constant]
   * @returns {object} paginateMeta
   */
  static paginateMeta(queryResult, page, itemsPerPage) {
    return paginateMeta(queryResult, page, itemsPerPage);
  }

  /**
   * Id Exists
   * @param {int} id
   * @param {string} scope
   * @returns {Promise}
   */
  static async idExists(id, scope) {
    if (!validator.isInt(id)) {
      throw new ApiError('Is not an ID.');
    }
    if (scope) {
      const count = await this.scope(scope).count({ where: { id: id } });
      return count > 0;
    }
    return (await this.count({ where: { id: id } })) > 0;
  }
}

exports.BaseModel = BaseModel;

/**
 * JSON parser
 * @param {array|object} obj object to parse
 * @param {object} options parse options
 * @param {Array.<string>} options.include fields to include
 * @param {Array.<string>} options.exclude fields to exclude
 * @param {Array.<Function|Promise>} options.maps fields to call for each field
 * @param {Function|Promise} options.maps[] fields to call for each field
 * @param {string} scopeName scope name
 */
const jsonSerializer = async (rs, options, scopeName) => {
  if (!rs) {
    return rs;
  }
  if (!options) {
    options = {};
  }
  if (_.isArray(rs)) {
    let rsList = [];
    await Promise.all(
      rs.map(async item => {
        rsList.push(await jsonSerializer(item, options, scopeName));
      })
    );
    return rsList;
  } else {
    let json = rs instanceof Model ? rs.toJSON() : rs;
    if (options.include) {
      json = _.pick(json, options.include);
    }
    if (options.exclude) {
      json = _.omit(json, options.exclude);
    }
    if (options.maps) {
      await Promise.all(
        Object.keys(options.maps).map(async key => {
          const item = options.maps[key];
          if (util.types.isAsyncFunction(item) || util.types.isPromise(item)) {
            json[key] = await item(json[key], scopeName, json);
          } else {
            json[key] = item(json[key], scopeName, json);
          }
        })
      );
    }
    return json;
  }
};

exports.jsonSerializer = jsonSerializer;
