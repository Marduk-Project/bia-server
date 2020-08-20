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
        <button
          type="button"
          @click="onNavBackClick"
          v-if="navBackRoute"
          class="btn btn-link mt-3"
        >
          <i class="fas fa-chevron-left"></i> Voltar
        </button>
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
        <h4 class="text-center">Recebemos a sua mensagem!</h4>
        <br />
        <p class="text-muted">
          Muito obrigado pelo seu contato.
          <br />
          Vamos responder o mais breve que conseguirmos.
          <br />
          Para continuar, acesse uma das opções abaixo.
        </p>
        <br />
        <div class="form-row">
          <div class="form-group col-12">
            <router-link
              type="button"
              tag="button"
              :to="{ name: 'or_order.state.select' }"
              class="w-100 btn btn-link"
            >
              Ir para Dashboard dos Estados
            </router-link>
          </div>
          <div class="form-group col-12">
            <router-link
              class="w-100 btn btn-link"
              tag="button"
              type="button"
              :to="{ name: 'auth.login' }"
            >
              <i class="fas fa-sign-in-alt"></i> Ir para Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  import { apiMixin } from '@mixins/api-mixin';

  export default {
    computed: {
      navBackRoute() {
        if (this.$route.params.navBackRoute) {
          return this.$route.params.navBackRoute;
        }
        return false;
      },
    },
    methods: {
      onNavBackClick() {
        this.$router.push(this.navBackRoute);
      },
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Contato recebido');
    },
  };
</script>

<style type="text/css" scoped></style>
