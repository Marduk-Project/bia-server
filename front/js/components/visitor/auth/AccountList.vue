<template>
  <div>
    <div class="app-bg-image"></div>
    <div class="container">
      <br>
      <br>
      <br>
      <br>
      <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12 app-bg-light bg-dark text-light">
        <br>
        <div v-if="(list.length == 0) && firstRequestDone" class="text-center">
          <h2>Ops... nenhuma conta?</h2>
          <p
            class
          >Nenhuma conta foi encontrada para seu usuário. Entre em contato com a administração para mais informações.</p>
        </div>
        <div v-else>
          <h2 class="text-center">Selecione uma conta abaixo</h2>
          <br>
        </div>
        <div v-for="entity in list" :key="entity._id" class="mb-3">
          <div
            class="btn btn-outline-light w-100 py-3"
            @click="onAccounClick(entity)"
          >{{ entity.shortname == entity.name ? entity.name : `${entity.shortname} - ${entity.name}` }}</div>
        </div>
        <br>
        <button type="button" href="/" class="btn btn-outline-danger w-100" @click="onLogoutClick">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
        <br>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../../libs/mixins/axios-auth";
import { apiMixin } from "../../../libs/mixins/api-mixin";
import loginInfoMixin from "../../../libs/mixins/login-info-mixin";

export default {
  mixins: [apiMixin, loginInfoMixin],
  data() {
    return {
      list: [],
      firstRequestDone: false
    };
  },
  methods: {
    onLogoutClick() {
      this.api_loadingShow();
      window.location.href = "/logout";
    },
    onAccounClick(entity) {
      this.login_setAccount(entity._id);
    },
    requestAccountList() {
      this.api_loadingShow();
      axios
        .get("/api/auth/account")
        .then(res => {
          this.api_loadingHide();
          this.list = res.data.data;
          this.firstRequestDone = true;
        })
        .catch(this.api_catch());
    },
    login_refreshInfoOKAfter() {
      this.requestAccountList();
    }
  },
  mounted() {
    this.$store.dispatch("setTitle", "Selecionar conta");
    if (this.$route.params.list) {
      this.list = this.$route.params.list;
      this.firstRequestDone = true;
    } else {
      this.login_refreshInfo();
    }
  }
};
</script>

<style type="text/css" scoped>
</style>
