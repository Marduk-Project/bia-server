export const utilsMixin = {
  methods: {
    /**
     * Parse hex to int color
     * @param {String} rrrggbb
     * @returns {Number}
     */
    utils_hexToIntColor(rrggbb) {
      if (!rrggbb) {
        return 0
      }
      rrggbb = rrggbb.replace('#', '')
      return parseInt(rrggbb, 16)
    },

    /**
     * Parse int to hex color
     * @param {Number} d
     * @returns {String}
     */
    utils_intColorToHex(d) {
      return `#${this.utils_decimalToHexString(d, 6)}`
    },

    /**
     * Parse int to hex string
     * @param {Number} number
     * @returns {String}
     */
    utils_decimalToHexString(d, padding = null) {
      let hex = Number(d).toString(16)
      hex = hex.replace('-', '')
      padding =
        typeof padding === 'undefined' || padding === null
          ? (padding = 2)
          : padding
      while (hex.length < padding) {
        hex = '0' + hex
      }
      return hex
    },
  },
}
