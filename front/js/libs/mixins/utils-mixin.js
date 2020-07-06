export const utilsMixin = {
  methods: {
    /**
     * Parse hex to int color
     * @param {String} rrrggbb
     * @returns {Number}
     */
    utils_hexToIntColor(rrggbb) {
      if (!rrggbb) {
        return 0;
      }
      rrggbb = rrggbb.replace('#', '');
      return parseInt(rrggbb, 16);
    },

    /**
     * Parse int to hex color
     * @param {Number} d
     * @returns {String}
     */
    utils_intColorToHex(d) {
      return `#${this.utils_decimalToHexString(d, 6)}`;
    },

    /**
     * Parse int to hex string
     * @param {Number} number
     * @returns {String}
     */
    utils_decimalToHexString(d, padding = null) {
      let hex = Number(d).toString(16);
      hex = hex.replace('-', '');
      padding =
        typeof padding === 'undefined' || padding === null
          ? (padding = 2)
          : padding;
      while (hex.length < padding) {
        hex = '0' + hex;
      }
      return hex;
    },

    /**
     * @typedef {Object} ShareResult
     * @param {String} method - 'navigator.share', 'clipboard', 'prompt'
     * @param {Boolean} result - ok or not
     * @param {Object} needsFeedback - if needs feedback to the user
     */

    /**
     * @param {Object} data
     * @param {String} data.title
     * @param {String} data.text
     * @param {String} data.url
     * @returns {Promise<ShareResult>}
     */
    async utils_shareData(data) {
      const result = {
        method: '?',
        result: false,
        needsFeedback: false,
      };
      // navigator
      if (window.navigator && window.navigator.share) {
        try {
          await window.navigator.share(data);
          result.result = true;
          result.needsFeedback = false;
          result.method = 'navigator.share';
          return result;
        } catch (err) {
          console.log(err);
        }
      }

      // clipboard
      try {
        if (await this.utils_copyToClipboard(data.url)) {
          result.result = true;
          result.method = 'clipboard';
          result.needsFeedback = true;
          return result;
        }
      } catch (err) {
        // TODO pensar
        console.log(err);
      }

      // prompt
      prompt('Copie a URL abaixo para compartilhar', data.url);
      result.result = true;
      result.method = 'prompt';
      result.needsFeedback = false;
      return result;
    },

    async utils_copyToClipboard(text) {
      const fallbackCopy = text => {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        let ok = false;
        try {
          ok = document.execCommand('copy');
          console.log('Fallback: Copying text command was ' + ok);
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
        return ok;
      };
      if (!navigator.clipboard) {
        return fallbackCopy(text);
      }
      // copy
      await navigator.clipboard.writeText(text);
      return true;
    },
  },
};
