<template>
  <div class="container">
    <br />
    <div class="text-center">Seja bem-vindo(a) ao portal de solicitações</div>
    <br />
    <br />
    <h4>Solicitar demanda ou informar recebimento</h4>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>Entidades disponíveis</th>
          <th>Cidade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entity in personContactList" :key="entity.id">
          <td>{{ entity.person.name }}</td>
          <td>{{ entity.person.city ? entity.person.city.name : '' }}</td>
          <td>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="onRequestClick"
            >
              <i class="fas fa-clipboard-list"></i> Solicitar
            </button>
            <button
              class="btn btn-outline-secondary ml-1"
              type="button"
              @click="onInformReceivedClick"
            >
              <i class="fas fa-clipboard-check"></i> Informar recebimento
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
    computed: {
      ...mapGetters({
        personContactList: 'getPersonContactList',
      }),
    },
    methods: {
      onRequestClick() {},
      onInformReceivedClick() {},
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Dashboard');
    },
  };
</script>

<style scoped></style>
