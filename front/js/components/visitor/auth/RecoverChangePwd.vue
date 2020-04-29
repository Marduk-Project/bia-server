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
          />
        </div>
        <br />
        <h4 class="text-center">Digite sua nova senha</h4>
        <div class="form-row">
          <div class="form-group col-12">
            <input
              class="form-control"
              type="password"
              name="password"
              placeholder="nova senha"
              v-model="login.password"
              v-validate="'required'"
              @keyup.enter="onSaveClick"
              :class="{ 'is-invalid': errors.has('password') && wasValidated }"
            />
            <small
              v-show="errors.has('password') && wasValidated"
              class="text-danger"
              >Campo obrigatório.</small
            >
          </div>
          <div class="form-group col-xl-12 mb-0">
            <button
              class="w-100 btn btn-success"
              type="button"
              @click="onSaveClick"
            >
              <i class="fas fa-key"></i> Salvar e ir para login
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
        password: null,
      },
    }
  },
  methods: {
    onBackClick() {
      this.$router.push({
        name: 'auth.login',
      })
    },
    onSaveClick() {
      let jwt = this.$route.params.token
      jwt = JSON.parse(Buffer.from(jwt, 'base64').toString('utf-8'))
      this.$validator.validateAll().then(result => {
        this.wasValidated = true
        if (!result) {
          return
        }
        let data = {
          password: this.login.password,
          id: jwt.id,
          token: jwt.token,
        }
        this.api_loadingShow()
        axios
          .post('/api/auth/recoverChangePwd', data)
          .then(
            this.api_thenDone(res => {
              this.onBackClick()
            })
          )
          .catch(
            this.api_catch(error => {
              this.$refs.pwd.focus()
            })
          )
      })
    },
  },
  mounted() {
    this.$store.dispatch('setTitle', 'Recuperar senha')
  },
}
</script>

<style type="text/css" scoped></style>
