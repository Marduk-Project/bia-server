import {
  // Load State
  GL_PRODUCT_LOADED,
  GL_PRODUCT_LOADING,
  GL_PRODUCT_LOADING_ERROR,

  // Add
  GL_PRODUCT_ADDED,
  GL_PRODUCT_ADDING,
  GL_PRODUCT_ADDING_ERROR,
} from './mutation-types';

export default {
  // Load State
  [GL_PRODUCT_LOADED](state, { data }) {
    state.list = data;
    state.isLoadingError = false;
    state.isLoading = false;
  },
  [GL_PRODUCT_LOADING](state) {
    state.list = [];
    state.isLoadingError = false;
    state.isLoading = true;
  },
  [GL_PRODUCT_LOADING_ERROR](state, message) {
    state.list = [];
    state.isLoadingError = true;
    state.isLoading = false;
  },

  // Add
  [GL_PRODUCT_ADDED](state, data) {
    state.list.push(data);
    state.isLoadingError = false;
    state.isLoading = false;
  },
  [GL_PRODUCT_ADDING](state) {
    state.isAddingError = false;
    state.isAdding = true;
  },
  [GL_PRODUCT_ADDING_ERROR](state, message) {
    state.isAddingError = true;
    state.isAdding = false;
  },
};
