import { BaseResourceApi } from '@mixins/resource-mixin';

export class API extends BaseResourceApi {
  baseUrl() {
    return `/api/${this.app_context}/gl_product`;
  }
}
