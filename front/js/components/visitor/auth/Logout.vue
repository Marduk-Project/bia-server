<template>
  <div>
    <div class="app-bg-image"></div>
    <div class="container">
      <br />
      <br />
      <br />
      <br />
      <div
        class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12 app-bg-light"
      >
        <br />
        <div class="text-center">
          <img
            class="img-fluid"
            src="../../../../img/theme/logo-vertical.png"
            style="max-width: 250px;"
            alt
          />
        </div>
        <br />
        <p class="text-center text-info">Você realizou logout com sucesso.</p>
        <br />
        <button
          type="button"
          class="btn btn-success w-100"
          @click="onLoginClick"
        >
          <i class="fas fa-sign-in-alt"></i> Ir para Login
        </button>
        <br />
        <br />
        <a href="/" class="btn btn-outline-secondary w-100">
          <i class="fas fa-home"></i> Retornar para home
        </a>
        <br />
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@mixins/axios-auth'
import { apiMixin } from '@mixins/api-mixin'

export default {
  mixins: [apiMixin],
  computed: {
    login_redirectIfNotLogged() {
      return false
    },
  },
  data() {
    return {}
  },
  methods: {
    onLoginClick() {
      this.$router.push({
        name: 'auth.login',
      })
    },
    login_refreshInfoOKAfter() {
      if (this.loginInfo.user == null) {
        // nao faz nada
      }
    },
  },
  mounted() {
    this.$store.dispatch('setTitle', 'Logout com sucesso')
    this.notify_success('Você realizou um logout com sucesso.')
  },
}
</script>

<style type="text/css" scoped></style>
