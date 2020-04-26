import axios from "./axios-auth";
import { apiMixin } from "./api-mixin";

// login info mixin
export default {
  mixins: [apiMixin],
  data() {
    return {
      loginInfo: {
        user: null,
        account: null,
      },
    };
  },
  computed: {
    login_redirectIfNotLogged() {
      return true;
    },
  },
  methods: {
    login_onResponseAction(data) {
      // loga
      // TODO controlar javascript do navegador e enviar
      // sessao para o dispositivo
      this.api_loadingShow();
      window.location.href = data.data.url;
    },
    login_refreshInfo() {
      // busca sessao
      this.api_loadingShow();
      axios
        .get("api/auth/session")
        .then((res) => {
          this.api_loadingHide();
          if (res.data) {
            // status error
            if (res.data.status) {
              if (res.data.status == 400) {
                // TODO revisar este metodo
                this.$store.dispatch(
                  "redirectToHome",
                  "Session expired! Redirecting..."
                );
                return;
              }
            }
            this.loginInfo = res.data;
          }
          if (!this.loginInfo.user && this.login_redirectIfNotLogged) {
            this.$store.dispatch("redirectToHome", "User not logged.");
          } else {
            this.login_refreshInfoOKAfter();
          }
        })
        .catch((reason) => {
          this.$store.dispatch(
            "redirectToHome",
            "Session expired! Redirecting..."
          );
        });
    },
    login_setAccount(id) {
      axios
        .post("/api/auth/setAccount", {
          id: id,
        })
        .then(
          this.api_thenDone((res) => {
            this.api_loadingShow();
            window.location.href = "/home";
          }, true)
        )
        .catch(this.api_catch());
    },
    login_refreshInfoOKAfter() {
      // gancho
    },
  },
  mounted() {},
};
