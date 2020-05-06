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
          <div class="form-group col-xl-12">
            <button
              class="w-100 btn btn-success"
              type="button"
              @click="onEnterClick"
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
          <div class="form-group col-12 text-center">
            <a :href="app_website" target="_contact" class="btn btn-link"
              >Dúvidas? Entre em contato conosco.</a
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

  export default {
    mixins: [apiMixin, loginInfoMixin],
    computed: {
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
        this.$validator.validateAll().then(result => {
          this.wasValidated = true;
          if (!result) {
            return;
          }
          let data = {
            username: this.login.username,
            password: this.login.password,
          };
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
    },
  };
</script>

<style type="text/css" scoped></style>
