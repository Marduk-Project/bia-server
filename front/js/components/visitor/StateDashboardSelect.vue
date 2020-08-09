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
            src="../../../img/theme/logo-vertical.png"
            style="max-width: 250px;"
            alt
          />
        </div>
        <br />
        <h4 class="text-center">Selecione o Estado abaixo</h4>
        <div class="list-group">
          <button
            v-for="entity in list"
            :key="entity.id"
            type="button"
            class="list-group-item list-group-item-action"
            @click="onStateClick(entity)"
          >
            {{ entity.name }}
          </button>
        </div>
        <br />
        <button class="w-100 btn btn-link" type="button" @click="onBackClick">
          <i class="fas fa-sign-in-alt"></i> Ir para Login
        </button>
        <br />
        <br />
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  import { apiMixin } from '@mixins/api-mixin';
  import { API as StateAPI } from '@resources/gl_state/state_api';

  export default {
    mixins: [apiMixin],
    data() {
      return {
        list: [],
      };
    },
    methods: {
      onBackClick() {
        this.$router.push({
          name: 'auth.login',
        });
      },
      requestStateList() {
        this.api_loadingShow();
        const api = new StateAPI();
        api
          .requestList()
          .then(res => {
            this.api_loadingHide();
            this.list = res.data;
          })
          .catch(this.api_catch());
      },
      onStateClick(entity) {
        this.$router.push({
          params: { id: entity.id },
          name: 'or_order.state.dashboard',
        });
      },
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Selecionar Estado');
      this.requestStateList();
    },
  };
</script>

<style type="text/css" scoped></style>
