export const recaptchaMixin = {
  data() {
    return {
      recaptcha: {
        token: null,
      },
    };
  },
  computed: {
    recaptcha_key() {
      return window.app_google_recaptcha_public_key;
    },
    recaptcha_htmlId() {
      return 'my-recaptcha';
    },
    recaptcha_isReady() {
      return !!this.recaptcha.token;
    },
    recaptcha_enabled() {
      return window.app_google_recaptcha_enabled;
    },
  },
  methods: {
    recaptcha_expiredCallback() {
      this.recaptcha.token = null;
    },
    recaptcha_callback(response) {
      this.recaptcha.token = response;
    },
    recaptcha_initIfNeeded() {
      if (!this.recaptcha_enabled) {
        return;
      }
      if (!window.grecaptcha || !window.grecaptcha.render) {
        setTimeout(this.recaptcha_initIfNeeded, 500);
        return;
      }
      window.grecaptcha.render(this.recaptcha_htmlId, {
        sitekey: this.recaptcha_key,
        callback: this.recaptcha_callback,
        'expired-callback': this.recaptcha_expiredCallback,
      });
    },
    recaptcha_reset() {
      if (!this.recaptcha_enabled) {
        return;
      }
      if (!window.grecaptcha || !window.grecaptcha.reset) {
        return;
      }
      window.grecaptcha.reset();
      this.recaptcha.token = null;
    },
  },
};
