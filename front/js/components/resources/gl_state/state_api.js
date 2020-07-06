import { BaseResourceApi } from '@mixins/resource-mixin';

export class API extends BaseResourceApi {
  baseUrl() {
    return `/api/common/gl_state`;
  }
}
