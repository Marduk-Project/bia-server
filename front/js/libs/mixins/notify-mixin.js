/**
 * Notify mixin with helper methods
 * This dispatches state events:
 * * notifyDone
 * * notifySuccess
 * * notifyInfo
 * * notifyWarning
 * * notifyDanger
 */
export const notifyMixin = {
  methods: {
    /**
     * Dispatch `notifyDone`
     * @deprecated
     * @returns {void}
     */
    api_notifyDone() {
      this.$store.dispatch('notifyDone')
    },

    /**
     * Dispatch `notifyDone`
     * @returns {void}
     */
    notify_done() {
      this.$store.dispatch('notifyDone')
    },

    /**
     * Dispatch `notifySuccess`
     * @deprecated
     * @param {string} message
     * @returns {void}
     */
    api_notifySuccess(message) {
      this.$store.dispatch('notifySuccess', message)
    },

    /**
     * Dispatch `notifySuccess`
     * @param {string} message
     * @returns {void}
     */
    notify_success(message) {
      this.$store.dispatch('notifySuccess', message)
    },

    /**
     * Dispatch `notifyInfo`
     * @deprecated
     * @param {string} message
     * @returns {void}
     */
    api_notifyInfo(message) {
      this.$store.dispatch('notifyInfo', message)
    },

    /**
     * Dispatch `notifyInfo`
     * @param {string} message
     * @returns {void}
     */
    notify_info(message) {
      this.$store.dispatch('notifyInfo', message)
    },

    /**
     * Dispatch `notifyWarning`
     * @deprecated
     * @param {string} message
     * @returns {void}
     */
    api_notifyWarning(message) {
      this.$store.dispatch('notifyWarning', message)
    },

    /**
     * Dispatch `notifyWarning`
     * @param {string} message
     * @returns {void}
     */
    notify_warning(message) {
      this.$store.dispatch('notifyWarning', message)
    },

    /**
     * Dispatch `notifyDanger`
     * @deprecated
     * @param {string} message
     * @returns {void}
     */
    api_notifyDanger(message) {
      this.$store.dispatch('notifyDanger', message)
    },

    /**
     * Dispatch `notifyDanger`
     * @param {string} message
     * @returns {void}
     */
    notify_danger(message) {
      this.$store.dispatch('notifyDanger', message)
    },
  },
}
