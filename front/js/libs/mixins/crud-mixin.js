import axios from './axios-auth';
import { apiMixin } from './api-mixin';
import CrudButtons from '../components/crud/CrudButtons.vue';
import moment from 'moment';
import _ from 'lodash';

/**
 * Crud mixin utility
 */
export const crudMixin = {
  mixins: [apiMixin],
  props: {
    useRoute: {
      type: Boolean,
      required: false,
      default: true,
    },
    parentEntityIdParam: {
      type: Number,
      required: false,
      default: null,
    },
    idParam: {
      type: Number,
      required: false,
      default: null,
    },
    entityParam: {
      type: Object,
      required: false,
      default: null,
    },
  },
  components: {
    'app-crud-buttons': CrudButtons,
  },
  data() {
    return {
      id: null,
      entity: {},
      changed: false,
      parentEntity: null,
      parentEntityId: null,
      wsRequested: false,
    };
  },
  watch: {
    /**
     * Watches and changes document title
     * @param {string} title
     */
    crud_title(title) {
      this.$store.dispatch('setTitle', title);
    },

    /**
     * Watches entity object
     * @param {object} entity
     */
    entity(entity) {
      if (!entity) {
        return;
      }
      this.id = entity._id ? entity._id : entity.id;
    },
  },
  computed: {
    crud_hasParentEntity() {
      if (this.useRoute) {
        return this.$route.params.parentEntityId != null;
      } else {
        return this.parentEntityIdParam != null;
      }
    },
    // crud_title()
    // crud_url_base()
    // crud_route_base()
    crud_url_edit() {
      return null;
    },
    crud_scope() {
      return null;
    },
    crud_hasNavBackRoute() {
      if (this.useRoute) {
        if (this.$route.params.navBackRoute) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    /**
     * Builds data to post/put update
     * @returns {object}
     */
    crud_data() {
      return null;
    },

    /**
     * Validates the form
     * @returns {boolean}
     */
    crud_validate() {
      return true;
    },

    /**
     * Callback on validate error
     */
    crud_onValidateError() {
      // gancho
    },

    /**
     * Axios request the parent entity
     * @returns {Promise}
     */
    crud_requestParentEntity() {
      return Promise.reject('Implementar crud_requestParentEntity');
    },

    /**
     * Parse axios response object form parent entity
     * @param {object} res
     * @returns {object}
     */
    crud_requestParentEntityParseResponse(res) {
      if (res.data.entity) {
        return res.data.entity;
      }
      if (res.data.data) {
        return res.data.data;
      }
      return null;
    },

    /**
     * Execute all calls for refresh entity, also controling parent requests
     */
    crud_refreshEntity() {
      if (this.crud_hasParentEntity) {
        if (this.parentEntity == null) {
          this.api_loadingShow();
          this.crud_requestParentEntity()
            .then(res => {
              if (!this.api_parseOK(res)) {
                return;
              }
              if (res.data.warnings) {
                this.notify_warning(res.data.warnings);
              }
              this.parentEntity = this.crud_requestParentEntityParseResponse(
                res
              );
              this.api_loadingHide();
              this.crud_refreshEntityAction();
            })
            .catch(this.api_catch());
        } else {
          this.crud_refreshEntityAction();
        }
      } else {
        this.crud_refreshEntityAction();
      }
    },

    /**
     * Axios request the entity
     * @returns {Promise}
     */
    crud_requestEntity() {
      var url = this.crud_url_edit;
      if (!url) {
        url = this.crud_url_base + '/' + this.id + '/edit';
      }
      return axios.get(url);
    },

    /**
     * Parse axios response object to entity
     * @param {object} res
     * @returns {object}
     */
    crud_requestEntityParseResponse(res) {
      this.wsRequested = true;
      if (res.data.entity) {
        return res.data.entity;
      }
      if (res.data.data) {
        return res.data.data;
      }
      return null;
    },

    /**
     * Do the request only for the entity
     */
    crud_refreshEntityAction() {
      this.api_loadingShow();
      this.crud_requestEntity()
        .then(res => {
          if (!this.api_parseOK(res)) {
            return;
          }
          if (res.data.warnings) {
            this.notify_warning(res.data.warnings);
          }
          this.entity = this.crud_requestEntityParseResponse(res);
          this.api_loadingHide();
          this.crud_afterRefresh();
        })
        .catch(this.api_catch());
    },

    /**
     * Actions for onDelete event
     */
    crud_onDeleteAction() {
      this.api_loadingShow();
      axios
        .delete(this.crud_url_base + '/' + this.id)
        .then(
          this.api_thenDone(res => {
            this.changed = true;
            if (res.data.warnings) {
              this.notify_warning(res.data.warnings);
            }
            this.crud_navBack();
          })
        )
        .catch(this.api_catch());
    },

    /**
     * Crud has custom request
     */
    crud_saveHasCustomRequest() {
      return false;
    },

    /**
     * build custom request
     */
    crud_saveBuildRequest() {
      return Promise.reject('Implementar crud_saveBuildRequest()');
    },

    /**
     * Actions for on save event
     */
    crud_onSaveAction() {
      var validated;
      if (this.crud_scope) {
        validated = this.$validator.validateAll(this.crud_scope);
      } else {
        validated = this.$validator.validateAll();
      }
      validated.then(result => {
        if (!result) {
          this.crud_onValidateError();
          return;
        }
        if (!this.crud_validate()) {
          return;
        }
        var ax;
        if (this.crud_saveHasCustomRequest()) {
          ax = this.crud_saveBuildRequest();
        } else {
          let data = this.crud_data();
          if (!data) {
            this.notify_warning(
              'Implemente o metodo <b>crud_data()</b>, retornando o objeto de dados.'
            );
            return;
          }
          this.api_loadingShow();
          if (this.entity.id) {
            if (data instanceof FormData) {
              ax = axios.put(this.crud_url_base + '/' + this.id, data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
            } else {
              ax = axios.put(this.crud_url_base + '/' + this.id, data);
            }
          } else {
            if (data instanceof FormData) {
              ax = axios.post(this.crud_url_base, data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
            } else {
              ax = axios.post(this.crud_url_base, data);
            }
          }
        }
        ax.then(
          this.api_thenDone(res => {
            this.changed = true;
            const entity = this.crud_requestEntityParseResponse(res);
            const id = entity._id ? entity._id : entity.id;
            this.id = id;
            if (res.data.warnings) {
              this.notify_warning(res.data.warnings);
            }
            if (this.crud_shouldNavBackAfterSave()) {
              this.crud_navBack();
            } else {
              if (this.crud_shouldRefreshAfterSave()) {
                this.crud_refreshEntity();
              } else {
                if (this.crud_shouldEditAfterSave()) {
                  const nav = this.crud_editBuildRoute(id);
                  this.$router.push(nav);
                }
              }
            }
            this.crud_afterSave();
          })
        ).catch(this.api_catch());
      });
    },

    /**
     * Builds route for navBack method
     * @returns {object}
     */
    crud_navBackBuildRoute() {
      if (this.useRoute) {
        if (this.$route.params.navBackRoute) {
          let route = this.$route.params.navBackRoute;
          if (!route.params) {
            route.params = {};
          }
          route.params.changed = this.changed;
          return route;
        }
      }
      return {
        name: this.crud_route_base + '.index',
        params: {
          page: this.useRoute ? this.$route.params.page : null,
          changed: this.changed,
          parentEntity: this.parentEntity,
          parentEntityId: this.useRoute
            ? this.$route.params.parentEntityId
            : this.parentEntityId,
        },
      };
    },

    /**
     * Build route for edit
     */
    crud_editBuildRoute(id) {
      return {
        name: this.crud_route_base + `.edit`,
        params: {
          id: id,
          changed: this.changed,
          page: this.useRoute ? this.$route.params.page : null,
          parentEntity: this.parentEntity,
          parentEntityId: this.useRoute
            ? this.$route.params.parentEntityId
            : this.parentEntityId,
        },
      };
    },

    /**
     * Execute navBack route
     */
    crud_navBack() {
      this.$router.push(this.crud_navBackBuildRoute());
    },

    /**
     * Build my route
     */
    crud_buildMyRoute() {
      return {
        name: this.$route.name,
        params: this.$route.params,
      };
    },

    /**
     * Callback to vefore mount
     */
    crud_beforeMount() {
      // gancho
    },

    /**
     * Callback to after mount
     */
    crud_afterMount() {
      // gancho
    },

    /**
     * Check if shuold navBack after save
     * @returns {boolean}
     */
    crud_shouldNavBackAfterSave() {
      return true;
    },

    /**
     * Callback for crud after save (without navBack)
     */
    crud_afterSave() {
      // gancho
    },

    /**
     * Callback for crud after refresh
     */
    crud_afterRefresh() {
      // gancho
    },

    /**
     * Callback for crud after save
     */
    crud_shouldRefreshAfterSave() {
      return true;
    },

    /**
     * Callback for crud after save
     */
    crud_shouldEditAfterSave() {
      return false;
    },

    /**
     * Moment js
     */
    crud_moment(date) {
      return moment(date);
    },
  },
  mounted() {
    this.crud_beforeMount();
    if (this.useRoute) {
      this.$store.dispatch('setTitle', this.crud_title);
      this.parentEntity = this.$route.params.parentEntity;
      this.parentEntityId = this.$route.params.parentEntityId;
      if (this.$route.params.changed !== undefined) {
        this.changed = this.$route.params.changed;
      }
      if (this.$route.params.entity) {
        _.merge(this.entity, this.$route.params.entity);
        // this.entity = this.$route.params.entity;
        this.id = this.entity._id ? this.entity._id : this.entity.id;
      } else {
        this.id = this.$route.params.id;
      }
    } else {
      this.entity = this.entityParam;
      this.id = this.idParam;
      this.parentEntityId = this.parentEntityIdParam;
    }
    // sempre busca
    if (this.id) {
      this.crud_refreshEntity();
    }
    this.crud_afterMount();
  },
};
