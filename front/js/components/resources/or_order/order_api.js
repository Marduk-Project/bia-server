import { BaseResourceApi } from '@mixins/resource-mixin';
import { typeToString } from '@common/models/or_order';

export class API extends BaseResourceApi {
  baseUrl() {
    return `/api/${this.app_context}/or_order`;
  }
}

export const mixin = {
  methods: {
    typeToString: typeToString,
  },
  computed: {
    typeDesc() {
      if (!this.entity) {
        return '';
      }
      return typeToString(this.entity.type);
    },
  },
};
