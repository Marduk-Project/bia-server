import axios from './axios-auth'
import { apiMixin } from './api-mixin'

import RefreshButton from '../components/common/RefreshButton.vue'
import AddButton from '../components/crud/AddButton.vue'
import Pagination from '../components/crud/Pagination.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'

// list mixin
export const listMixin = {
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
    onItemClickCallback: {
      type: Function,
      required: false,
      default: null,
    },
  },
  components: {
    'app-pagination': Pagination,
    'app-refresh-button': RefreshButton,
    'app-add-button': AddButton,
  },
  data() {
    return {
      list: {
        data: [],
        current_page: 1,
      },
      parentEntity: null,
      parentEntityId: null,
      searchText: '',
      filters: null,
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'isLoading',
    }),
    list_hasParentEntity() {
      return this.useRoute
        ? this.$route.params.parentEntityId != null
        : this.parentEntityId
    },
    list_hasNavBackRoute() {
      if (this.useRoute) {
        if (this.$route.params.navBackRoute) {
          return true
        }
      }
      return false
    },
    // list_url_base()
    // list_route_base()
    // list_title()
  },
  methods: {
    /**
     * Build request URL
     * @param {number} page
     * @returns {string}
     */
    list_buildURL(page) {
      let url = `${this.list_url_base}?page=${page}`
      if (this.searchText) {
        url += `&q=${encodeURIComponent(this.searchText)}`
      }
      return url
    },

    /**
     * Builds create/add route
     * @returns {object}
     */
    list_onAddBuildRoute() {
      return {
        name: this.list_route_base + '.create',
        params: {
          id: null,
          entity: null,
          parentEntity: this.parentEntity,
          parentEntityId: this.useRoute
            ? this.$route.params.parentEntityId
            : this.parentEntityId,
          page: {
            page: this.list,
            searchText: this.searchText,
            filters: this.filters,
          },
        },
      }
    },

    /**
     *
     */
    list_onAddClick() {
      this.$router.push(this.list_onAddBuildRoute())
    },

    /**
     * Refresh current page
     */
    list_refreshCurrentPage() {
      var page
      if (this.list) {
        page = this.list.current_page
      }
      if (!page) {
        page = 1
      }
      this.list_refreshPage(page)
    },

    /**
     * Builds request parent entity
     * @returns {Promise}
     */
    list_requestParentEntity() {
      return Promise.reject('Implementar list_requestParentEntity.')
    },

    /**
     * Parse Axios parent entity response
     * @param {object} res
     * @returns {object}
     */
    list_requestParentEntityParseResponse(res) {
      if (res.data.entity) {
        return res.data.entity
      }
      if (res.data.data) {
        return res.data.data
      }
      return null
    },

    /**
     * list_refreshCurrentPage
     * @param {number} page
     */
    list_refreshPage(page) {
      if (this.list_hasParentEntity) {
        if (this.parentEntity == null) {
          this.list_requestParentEntity()
            .then(res => {
              if (!this.api_parseOK(res)) {
                return
              }
              this.parentEntity = this.list_requestParentEntityParseResponse(
                res
              )
              this.api_loadingHide()
              if (res.data.warnings) {
                this.notify_warning(res.data.warnings)
              }
              this.list_requestPageAction(page)
            })
            .catch(this.api_catch())
        } else {
          this.list_requestPageAction(page)
        }
      } else {
        this.list_requestPageAction(page)
      }
    },

    /**
     * Build axios request for page
     * @returns {Promise}
     */
    list_requestForPage(page) {
      return axios.get(this.list_buildURL(page))
    },

    /**
     * Executes Axios request for page
     * @param {number} page
     */
    list_requestPageAction(page) {
      this.api_loadingShow()
      this.list_requestForPage(page)
        .then(this.list_parseResponse())
        .catch(this.api_catch())
    },

    /**
     * Parse request responde
     * @param {Object} res
     * @returns {Function}
     */
    list_parseResponse() {
      return res => {
        if (!this.api_parseOK(res)) {
          return
        }
        if (res.data.page) {
          this.list = res.data.page
        } else if (res.data.data) {
          this.list = res.data
        }
        this.list_afterRequest(res)
        this.api_loadingHide()
        if (res.data.warnings) {
          this.notify_warning(res.data.warnings)
        }
      }
    },

    /**
     * Build route for onItemClick event
     * @returns {object}
     */
    list_onItemClickBuildRoute(entity) {
      return {
        name: this.list_route_base + '.edit',
        params: {
          id: entity ? entity.id : null,
          entity: entity,
          parentEntity: this.parentEntity,
          parentEntityId: this.useRoute
            ? this.$route.params.parentEntityId
            : this.parentEntityId,
          page: {
            page: this.list,
            searchText: this.searchText,
            filters: this.filters,
          },
        },
      }
    },

    /**
     * Build my navBack route
     */
    list_buildMyRoute() {
      return {
        name: this.$route.name,
        params: {
          page: {
            page: this.list,
            searchText: this.searchText,
            filters: this.filters,
          },
        },
      }
    },

    /**
     * Action for on itemClick
     */
    list_onItemClick(entity) {
      if (this.onItemClickCallback) {
        this.onItemClickCallback(entity)
      } else {
        this.$router.push(this.list_onItemClickBuildRoute(entity))
      }
    },

    /**
     * Build navBack route
     * @returns {object|null}
     */
    list_navBackBuildRoute() {
      if (this.useRoute) {
        if (this.$route.params.navBackRoute) {
          let route = this.$route.params.navBackRoute
          route.params.changed = this.$route.params.changed
          return route
        }
      }
      this.notify_warning('Implementar list_navBackBuildRoute')
      return null
    },

    /**
     * Execute navBack event
     */
    list_navBack() {
      let route = this.list_navBackBuildRoute()
      if (route) {
        this.$router.push(route)
      }
    },

    /**
     * Callback for beforeMount
     */
    list_beforeMount() {
      // gancho
    },

    /**
     * Callback for aftermount
     */
    list_afterMount() {
      // gancho
    },

    /**
     * Moment js
     */
    list_moment(date) {
      return moment(date)
    },

    /**
     * After request
     */
    list_afterRequest(res) {
      // ganch
    },

    /**
     * Should refresh on mount
     */
    list_refrehOnMount() {
      return true
    },

    /**
     * force refresh on params
     */
    list_forceRefrehOnMountWithParam() {
      return false
    },
  },
  mounted() {
    this.list_beforeMount()
    if (this.useRoute) {
      this.$store.dispatch('setTitle', this.list_title)
      this.parentEntity = this.$route.params.parentEntity
      this.parentEntityId = this.$route.params.parentEntityId
    } else {
      this.parentEntityId = this.parentEntityIdParam
    }
    // load
    if (this.$route.params.page && this.useRoute) {
      let refresh = true
      if (this.$route.params.page.page) {
        this.list = this.$route.params.page.page
        refresh = false
      }
      this.searchText = this.$route.params.page.searchText
      this.filters = _.merge(this.filters, this.$route.params.page.filters)
      if (
        this.$route.params.changed ||
        refresh ||
        this.list_forceRefrehOnMountWithParam()
      ) {
        this.list_refreshCurrentPage()
      }
    } else {
      if (this.list_refrehOnMount()) {
        this.list_refreshPage(1)
      }
    }
    this.list_afterMount()
  },
}
