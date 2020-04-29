import Vue from 'vue'
import Vuex from 'vuex'

import notification from './modules/notification'

import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: 0,
  },
  actions,
  getters,
  mutations,
  modules: {
    notification,
  },
})
