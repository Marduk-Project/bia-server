<template>
  <div class="container">
    <br />
    <h2 class="text-center">Bem-vindo ao painel administrativo.</h2>
    <div class="jumbotron">
      <blockquote class="blockquote">
        <p class="mb-0">
          "Antes do Sol engolir o planeta Terra, daqui há 1 bilhão de anos,
          teremos um dashboard aqui. Acreditem nisto! :)"
        </p>
        <div class="blockquote-footer">
          <cite class="text-muted">Carlos Borges</cite>
        </div>
      </blockquote>
      <a class="btn btn-secondary" href="/#/or_order/state">
        Selecionar Estado para visualizar Dashboard
      </a>
    </div>
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  import { apiMixin } from '@mixins/api-mixin';
  import { mapGetters } from 'vuex';

  export default {
    mixins: [apiMixin],
    data() {
      return {
        account: null,
        level: 10,
      };
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Dashboard');
    },
  };
</script>

<style scoped></style>
