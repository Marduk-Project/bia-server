<template>
  <div>
    <br />
    <h1>Importação de dados</h1>
    <p class="text-danger">
      <strong>Atenção!</strong> Configurações erradas podem fazer o sistema
      parar de funcionar.<br />
    </p>
    <div>
      <button class="btn btn-outline-secondary" @click="onIbgeImportClick">
        <i class="fas fa-database"></i> Importar Cidades do IBGE
      </button>
      <button
        class="btn btn-outline-secondary ml-1"
        @click="onCityRegionImportClick"
      >
        <i class="fas fa-database"></i> Importar Regiões de Saúde
      </button>
      <button
        class="btn btn-outline-secondary ml-1"
        @click="onProductImportClick"
      >
        <i class="fas fa-database"></i> Importar Produtos
      </button>
    </div>
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  import { apiMixin } from '@mixins/api-mixin';

  export default {
    mixins: [apiMixin],
    data() {
      return {
        file_content: '',
        wsLoadOK: false,
      };
    },
    methods: {
      onConfirmCheck() {
        const response = prompt(
          'Esta rotina é longa, e pode deixar o servidor bastante lento. Digite "importar" para prosseguir.',
          'não'
        );
        if (response != 'importar') {
          return false;
        }
        return true;
      },
      onIbgeImportClick() {
        if (!this.onConfirmCheck()) {
          return;
        }
        axios
          .post(`/api/admin/maintenance/ibgeCityImport`)
          .then(this.api_thenDone())
          .catch(this.api_catch());
      },
      onCityRegionImportClick() {
        if (!this.onConfirmCheck()) {
          return;
        }
        axios
          .post(`/api/admin/maintenance/cityRegionImport`)
          .then(this.api_thenDone())
          .catch(this.api_catch());
      },
      onProductImportClick() {
        if (!this.onConfirmCheck()) {
          return;
        }
        axios
          .post(`/api/admin/maintenance/productImport`)
          .then(this.api_thenDone())
          .catch(this.api_catch());
      },
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Importar dados');
    },
  };
</script>

<style scoped></style>
