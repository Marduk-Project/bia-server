<template>
  <div class="container">
    <br>
    <h2 class="text-center">Bem-vindo ao painel administrativo.</h2>
    <div class="card">
      <div class="card-header">Gerenciar conta</div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group col-lg-6">
            <label>1. Selecione uma conta</label>
            <app-account-select v-model="account"></app-account-select>
          </div>
          <div class="form-group col-lg-3">
            <label>2. Selecione o nível</label>
            <app-user-account-level-select v-model="level"></app-user-account-level-select>
          </div>
          <div class="form-group col-lg-3">
            <label>3. Acesse</label>
            <button class="btn btn-success w-100" @click="onGoToAccountClick">
              <i class="fas fas-tachometer-alt"></i> Acessar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../libs/mixins/axios-auth";
import { apiMixin } from "../../libs/mixins/api-mixin";
import AccountSelect from "../../components/resources/account/AccountSelect.vue";
import { mapGetters } from "vuex";
import UserAccountLevelSelect from '../resources/user/UserAccountLevelSelect.vue';

export default {
  mixins: [apiMixin],
  components: {
    "app-account-select": AccountSelect,
    'app-user-account-level-select': UserAccountLevelSelect,
  },
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
      level: 10,
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
          level: this.level,
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