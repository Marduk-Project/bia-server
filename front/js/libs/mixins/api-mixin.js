const { notifyMixin } = require('./notify-mixin')
const _ = require('lodash')

/**
 * Parse error if exists and return its string object.
 * @param error
 * @returns {string}
 */
export const api_parseErrorMessage = error => {
  var errorChecked = null
  if (_.isObject(error)) {
    if (_.isObject(error.response)) {
      if (_.isObject(error.response.data)) {
        if (_.isString(error.response.data.message)) {
          if (error.response.data.message.length > 0) {
            var message = error.response.data.message
            if (error.response.data.errors) {
              const errors = error.response.data.errors
              if (_.isObject(errors)) {
                message += '<ul>'
                for (var key in errors) {
                  var element = errors[key]
                  message += `<li><strong>${key}:</strong> ${element}</li>`
                }
                message += '</ul>'
              } else if (_.isArray(errors)) {
                message += '<ul>'
                errors.forEach(element => {
                  message += `<li>${element}</li>`
                })
                message += '</ul>'
              } else if (_.isString(errors)) {
                message += `<strong>${errors}</strong>`
              } else {
                // check if ist not string
                message += `<strong>${errors}</strong>`
              }
            }
            errorChecked = message
          }
        }
      }
    }
  }
  if (errorChecked == null) {
    errorChecked = `Erro na página, tente recarregar seu navegador. <br/><strong>${error}</strong>`
    console.warn(error)
  }
  return errorChecked
}

/**
 * Api mixin that works with axios / std results.
 */
export const apiMixin = {
  mixins: [notifyMixin],
  methods: {
    /**
     * Parses an axios response object, and returns its result.
     * Also decrement loading state.
     * @param {object} res
     * @param {boolean} ignoreLoading should not decrement loading state.
     * @returns {boolean}
     */
    api_parseOK(res, ignoreLoading = false) {
      var err = false
      if (!res) {
        err = true
      }
      if (!res.data) {
        err = true
      }
      if (err) {
        if (!ignoreLoading) {
          this.api_loadingHide()
        }
        console.warn('Objeto axios de resposta "undefined|null"')
        this.notify_danger(
          'Objeto de resposta "undefined|null". Verificar axios.<br /> Esta mensagem é um erro interno, por favor informe a administração do sistema.'
        )
        return false
      }
      if (res.data.status == 400) {
        if (!ignoreLoading) {
          this.api_loadingHide()
        }
        this.notify_danger(res.data.message)
        return false
      }
      return true
    },

    /**
     * Returns a function that pares and check axios data
     * @param {function} callback
     * @param {boolean} ignoreDone does not call notify_done if set
     */
    api_thenDone(callback = undefined, ignoreDone = false) {
      return res => {
        if (!this.api_parseOK(res)) {
          return
        }
        this.api_loadingHide()
        if (!ignoreDone) {
          this.notify_done()
        }
        if (_.isFunction(callback)) {
          callback(res)
        }
      }
    },

    /**
     * Returns a function that catches the api errors
     * @param {function} callback
     * @returns {function}
     */
    api_catch(callback = undefined) {
      return error => {
        this.api_parseError(error, false)
        if (_.isFunction(callback)) {
          callback(error)
        }
      }
    },

    /**
     * Parse error message, decrementing loading if applicable
     * @param {object|array|string} error error object or message string
     * @param {boolean} ignoreLoading if should ignore loading
     * @returns {void}
     */
    api_parseError(error, ignoreLoading) {
      if (!ignoreLoading) {
        this.api_loadingHide()
      }
      var message = api_parseErrorMessage(error)
      this.notify_danger(message)
    },

    /**
     * Decrements setLoading state
     * @returns {void}
     */
    api_loadingHide() {
      this.$store.commit('setLoading', false)
    },

    /**
     * Increments setLoading state
     * @returns {void}
     */
    api_loadingShow() {
      this.$store.commit('setLoading', true)
    },
  },
}
