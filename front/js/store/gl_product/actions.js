import axios from '@mixins/axios-auth';

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
  load({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (state.list.length > 0) {
        resolve(state.list);
      } else {
        commit(GL_PRODUCT_LOADING);
        axios
          .get(`http://localhost:3000/api/admin/gl_product`)
          .then(res => {
            if (res.data) {
              commit(GL_PRODUCT_LOADED, res.data);
              resolve(res.data.data);
            }
          })
          .catch(() => {
            commit(GL_PRODUCT_LOADING_ERROR);
            reject();
          });
      }
    });
  },
  add({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit(GL_PRODUCT_ADDING);
      axios
        .post(`http://localhost:3000/api/admin/gl_product`, data)
        .then(res => {
          if (res.data) {
            commit(GL_PRODUCT_ADDED, { id: res.data.entity.id, ...data });
            resolve(res.data);
          }
        })
        .catch(error => {
          commit(GL_PRODUCT_ADDING_ERROR, error.message);
          reject();
        });
    });
  },
};
