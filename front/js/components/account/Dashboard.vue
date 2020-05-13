<template>
  <div class="container">
    <br />
    <div class="text-center">Seja bem-vindo(a) ao portal de solicitações</div>
    <br />
    <br />
    <center>
      <router-link
        class="btn btn-outline-secondary"
        tag="a"
        :to="{ name: 'or_order.create' }"
      >
        <i class="fas fa-clipboard-list"></i> Solicitar demanda
      </router-link>
      <br />
      <br />
      <router-link
        class="btn btn-outline-secondary ml-1"
        tag="a"
        :to="{ name: 'or_order.index' }"
      >
        <i class="fas fa-clipboard-check"></i> Visualizar suas demandas
      </router-link>
    </center>
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  // import { apiMixin } from '@mixins/api-mixin';
  import { mapGetters } from 'vuex';

  export default {
    // mixins: [apiMixin],
    mounted() {
      this.$store.dispatch('setTitle', 'Dashboard');
    },
  };
</script>

<style scoped></style>
