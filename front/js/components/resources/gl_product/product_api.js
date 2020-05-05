import { BaseResourceApi } from '@mixins/resource-mixin';

export class API extends BaseResourceApi {
  baseUrl() {
    return `/api/${this.app_context}/gl_product`;
  }

  /**
   * @param {int} page
   * @param {String} searchText
   * @param {object} queryParams
   */
  async requestList(page, searchText, params) {
    return super.requestList(page, searchText, params);
  }
}
