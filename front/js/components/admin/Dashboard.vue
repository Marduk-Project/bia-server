<template>
  <div class="container">
    <br />
    <h2 class="text-center">Bem-vindo ao painel administrativo.</h2>
    <div class="jumbotron">
      <blockquote class="blockquote">
        <p
          class="mb-0"
        >"Antes do Sol engolir o planeta Terra, daqui à 1 bilhão de anos, teremos um dashboard aqui. Acreditem nisto! :)"</p>
        <div class="blockquote-footer">
          <cite class="text-muted">Carlos Borges</cite>
        </div>
      </blockquote>
    </div>
  </div>
</template>

<script>
import axios from "../../libs/mixins/axios-auth";
import { apiMixin } from "../../libs/mixins/api-mixin";
import { mapGetters } from "vuex";

export default {
  mixins: [apiMixin],
  components: {},
  computed: {
    ...mapGetters({
      sessionAccount: "getAccount"
    })
  },
  watch: {
    sessionAccount(value) {
      this.account = value;
      this.level = value.account_level;
    }
  },
  data() {
    return {
      account: null,
      level: 10
    };
  },
  methods: {
    onGoToAccountClick() {
      if (!this.account) {
        this.notify_warning("Selecione a conta.");
        return;
      }
      this.api_loadingShow();
      axios
        .post("/api/admin/auth/setAccount", {
          id: this.account._id,
          level: this.level
        })
        .then(
          this.api_thenDone(() => {
            this.api_loadingShow();
            window.location.href = "/account";
          }, true)
        )
        .catch(this.api_catch());
    }
  },
  mounted() {
    this.$store.dispatch("setTitle", "Dashboard");
  }
};
</script>

<style scoped>
</style>