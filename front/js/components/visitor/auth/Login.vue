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
        <h4 class="text-center">Login</h4>
        <!-- <p class="text-muted lead text-center">
                    Acesse ou crie uma conta para continuar
        </p>-->
        <div class="form-row">
          <div class="form-group col-12">
            <input
              class="form-control"
              type="text"
              name="username"
              placeholder="email@exemplo.com"
              v-model="login.username"
              v-validate="'required|email'"
              :class="{ 'is-invalid': errors.has('username') && wasValidated }"
            />
            <small
              v-show="errors.has('username') && wasValidated"
              class="text-danger"
            >
              <strong>E-mail</strong> é obrigatório.
            </small>
          </div>
          <div class="form-group col-12">
            <input
              ref="pwd"
              class="form-control"
              type="password"
              name="password"
              placeholder="sua senha"
              v-model="login.password"
              v-validate="'required'"
              :class="{ 'is-invalid': errors.has('password') && wasValidated }"
              @keyup.enter="onEnterClick"
            />
            <small
              v-show="errors.has('password') && wasValidated"
              class="text-danger"
              >Campo obrigatório.</small
            >
          </div>
          <div class="form-group col-12 mb-3" v-show="recaptcha_enabled">
            <div id="my-recaptcha"></div>
          </div>
          <div class="form-group col-12">
            <button
              class="w-100 btn btn-success"
              type="button"
              @click="onEnterClick"
              :disabled="!login_enabled"
            >
              <i class="fa fa-sign-in"></i> Login
            </button>
          </div>
          <div class="form-group col-12 text-center">
            <router-link
              tag="a"
              :to="{ name: 'auth.recover.request' }"
              class="btn btn-link"
              >Esqueceu sua senha?</router-link
            >
          </div>
          <div class="form-group col-12">
            <router-link
              tag="a"
              :to="{
                name: 'gl_form_contact.create',
                params: {
                  navBackRoute: {
                    name: 'auth.login',
                  },
                },
              }"
              class="w-100 btn btn-link"
            >
              Dúvidas? Entre em contato conosco.</router-link
            >
          </div>
          <div class="form-group col-12">
            <router-link
              tag="a"
              :to="{ name: 'or_order.state.select' }"
              class="w-100 btn btn-link"
            >
              Ir para Dashboard dos Estados</router-link
            >
          </div>
        </div>
      </div>
      <div clas="d-flex align-center justify-center"></div>
    </div>
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  import { apiMixin } from '@mixins/api-mixin';
  import loginInfoMixin from '@mixins/login-info-mixin';
  import { recaptchaMixin } from '@mixins/recaptcha-mixin';

  export default {
    mixins: [apiMixin, loginInfoMixin, recaptchaMixin],
    computed: {
      login_enabled() {
        if (this.login.username && this.login.password) {
          if (this.recaptcha_enabled) {
            return this.recaptcha_isReady;
          }
          return true;
        }
        return false;
      },
      login_redirectIfNotLogged() {
        return false;
      },
      app_website() {
        return window.app_website;
      },
    },
    data() {
      return {
        wasValidated: false,
        login: {
          try: false,
          username: null,
          password: null,
        },
      };
    },
    methods: {
      onEnterClick() {
        if (!this.login_enabled) {
          return;
        }
        this.$validator.validateAll().then(result => {
          this.wasValidated = true;
          if (!result) {
            return;
          }
          let data = {
            username: this.login.username,
            password: this.login.password,
          };
          if (this.recaptcha_enabled) {
            data.recaptchaToken = this.recaptcha.token;
          }
          this.api_loadingShow();
          axios
            .post('/api/auth/login', data)
            .then(
              this.api_thenDone(res => {
                // redirect to home
                const user = res.data;
                this.api_loadingShow();
                window.location.href = '/home';
                // if (user.isStaff) {
                // }
              }, true)
            )
            .catch(
              this.api_catch(error => {
                this.recaptcha_reset();
                this.$refs.pwd.focus();
              })
            );
        });
      },
      login_refreshInfoOKAfter() {
        if (this.loginInfo.user != null) {
          // redirect to home
          this.api_loadingShow();
          window.location.href = '/home';
        }
      },
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Portal');
      this.login_refreshInfo();
      this.recaptcha_initIfNeeded();
    },
  };
</script>

<style type="text/css" scoped></style>
