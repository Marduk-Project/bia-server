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
        <h4 class="text-center">Qual é o seu e-mail?</h4>
        <div class="form-row">
          <div class="form-group col-12">
            <input
              class="form-control"
              type="text"
              name="username"
              placeholder="email@exemplo.com"
              v-model="login.username"
              v-validate="'required|email'"
              @keyup.enter="onRecoverClick"
              :class="{ 'is-invalid': errors.has('username') && wasValidated }"
            />
            <small
              v-show="errors.has('username') && wasValidated"
              class="text-danger"
            >
              Campo
              <strong>e-mail</strong> é obrigatório.
            </small>
          </div>
          <div class="form-group col-xl-12">
            <button
              class="w-100 btn btn-success"
              type="button"
              @click="onRecoverClick"
            >
              <i class="fas fa-envelope"></i> Enviar e-mail com instruções
            </button>
          </div>
          <div class="form-group col-xl-12 mb-0">
            <button
              class="w-100 btn btn-link"
              type="button"
              @click="onBackClick"
            >
              <i class="fas fa-sign-in-alt"></i> Login
            </button>
          </div>
        </div>
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
  data() {
    return {
      wasValidated: false,
      login: {
        try: false,
        username: null,
      },
    }
  },
  methods: {
    onBackClick() {
      this.$router.push({
        name: 'auth.login',
      })
    },
    onRecoverClick() {
      this.$validator.validateAll().then(result => {
        this.wasValidated = true
        if (!result) {
          return
        }
        let data = {
          username: this.login.username,
        }
        this.api_loadingShow()
        axios
          .post('/api/auth/recoverRequest', data)
          .then(
            this.api_thenDone(res => {
              this.notify_success(
                'E-mail enviado com sucesso. Por favor verifique seu sua caixa e siga as instruções.'
              )
            }, true)
          )
          .catch(this.api_catch())
      })
    },
  },
  mounted() {
    this.$store.dispatch('setTitle', 'Esqueci minha senha')
  },
}
</script>

<style type="text/css" scoped></style>
