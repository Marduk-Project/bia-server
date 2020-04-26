import axios from "axios";
import _ from "lodash";
import $ from "jquery";

window.app_baseURL =
  window.location.protocol + "//" + window.location.host + "/";

const instance = axios.create({
  baseURL: window.app_baseURL,
});

const headers = _.cloneDeep(instance.defaults.headers);

let token = document.head.querySelector('meta[name="csrf-token"]');
let app_usuarioId = document.head.querySelector('meta[name="app-api-user-id"]');
let app_sessaoTokenId = document.head.querySelector(
  'meta[name="app-api-token"]'
);

headers.common["X-Requested-With"] = "XMLHttpRequest";
headers.get["Accepts"] = "application/json";
// sets
// if (token) {
//   headers.common['X-CSRF-TOKEN'] = token.content;
// } else {
//   console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
// }
if (app_usuarioId) {
  headers.common["X-APP-API-USER-ID"] = app_usuarioId.content;
}
if (app_sessaoTokenId) {
  headers.common["X-APP-API-TOKEN"] = app_sessaoTokenId.content;
}

instance.interceptors.request.use((request) => {
  // base
  return request;
});

/**
 * Add Http Headers to JQuery requests
 */
export const jq_setupGlobal = () => {
  $.ajaxSetup({
    beforeSend: function (xhr) {
      if (token) {
        xhr.setRequestHeader("X-CSRF-TOKEN", token.content);
      }
      if (app_usuarioId) {
        xhr.setRequestHeader("X-APP-API-USER-ID", app_usuarioId.content);
      }
      if (app_sessaoTokenId) {
        xhr.setRequestHeader("X-APP-API-TOKEN", app_sessaoTokenId.content);
      }
    },
  });
};

/**
 * Add Http Headers to JQuery requests
 */
export const jq_beforeSend = (xhr) => {
  if (token) {
    xhr.setRequestHeader("X-CSRF-TOKEN", token.content);
  }
  if (app_usuarioId) {
    xhr.setRequestHeader("X-APP-API-USER-ID", app_usuarioId.content);
  }
  if (app_sessaoTokenId) {
    xhr.setRequestHeader("X-APP-API-TOKEN", app_sessaoTokenId.content);
  }
};

/**
 * Parse and return error message data.
 * @param error
 * @returns String
 */
export const api_parseErrorMessage = (error) => {
  var errorChecked = null;
  if (_.isObject(error)) {
    if (_.isObject(error.response)) {
      if (_.isObject(error.response.data)) {
        if (_.isString(error.response.data.message)) {
          if (error.response.data.message.length > 0) {
            var message = error.response.data.message;
            if (error.response.data.errors) {
              const errors = error.response.data.errors;
              if (_.isObject(errors)) {
                message += "<ul>";
                for (var key in errors) {
                  var element = errors[key];
                  message += `<li><strong>${key}:</strong> ${element}</li>`;
                }
                message += "</ul>";
              } else if (_.isArray(errors)) {
                message += "<ul>";
                errors.forEach((element) => {
                  message += `<li>${element}</li>`;
                });
                message += "</ul>";
              } else if (_.isString(errors)) {
                message += `<strong>${errors}</strong>`;
              } else {
                // check if ist not string
                message += `<strong>${errors}</strong>`;
              }
            }
            errorChecked = message;
          }
        }
      }
    }
  }
  if (errorChecked == null) {
    errorChecked = `Erro na página, tente recarregar seu navegador. <br/><strong>${error}</strong>`;
    console.warn(error);
  }
  return errorChecked;
};

instance.defaults.headers = headers;

export default instance;
