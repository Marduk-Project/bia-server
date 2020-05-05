import axios from './axios-auth';

export class BaseResourceApi {
  /**
   * @property {string} app_context
   */
  app_context = window.app_context;

  /**
   * @param {object} options
   * @param {string} [options.app_context=window.app_context]
   */
  constructor(options) {
    if (!options) {
      options = {};
    }
    this.app_context = options.app_context || window.app_context;
  }

  baseUrl() {
    return '/';
  }

  /**
   * @param {int} page
   * @param {String} searchText
   * @param {Object} queryParams
   */
  async requestList(page, searchText, queryParams) {
    try {
      let url = `${this.baseUrl()}`;
      const query = {};
      if (page) {
        query.page = page;
      }
      if (searchText) {
        query.searchText = searchText;
      }
      if (queryParams) {
        Object.assign(query, queryParams);
      }
      const res = await axios.get(url, { params: query });
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {int|String} id
   * @param {Object} queryParams
   */
  async requestEntity(id, queryParams) {
    try {
      let url = `${this.baseUrl()}/${id}/edit`;
      const res = await axios.get(url, { params: queryParams });
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @typedef {Object} SaveResult
   * @param {Object} data - the object data
   * @param {String|Array} warnings - eventual warnings
   * @param {Object} metadata - eventual result metadata
   */

  /**
   * @param {Object|FormData} entity
   * @param {Object} options
   * @param {Object} options.id force a ID on FormData entity
   * @param {Object} options.queryParams
   */
  async saveEntity(entity, options) {
    try {
      if (!options) {
        options = {};
      }
      let res = null;
      if (entity instanceof FormData) {
        if (options.id) {
          res = await axios.post(`${this.baseUrl()}/${entity.id}`, entity, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: options.queryParams,
          });
        } else {
          res = await axios.post(this.baseUrl(), entity, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            params: options.queryParams,
          });
        }
      } else if (entity.id) {
        res = await axios.put(`${this.baseUrl()}/${entity.id}`, entity, {
          params: options.queryParams,
        });
      } else {
        res = await axios.post(this.baseUrl(), entity, {
          params: options.queryParams,
        });
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @typedef {Object} DeleteResult
   * @property {number} data - The deleted object data
   * @property {number} warnings - Eventual warning messages
   */

  /**
   * @param {integer} entity
   * @param {Object} queryParams
   * @typedef {Object}
   * @returns {DeleteResult}
   */
  async deleteEntity(id, queryParams) {
    try {
      let res = await axios.delete(`${this.baseUrl()}/${id}`, {
        params: queryParams,
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  }
}
