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
    <br />
    <div class="card">
      <div class="card-header">
        Importar <strong>JSON consolidado</strong> do boletim
      </div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group col-12">
            <label>Selecionar arquivo</label>
            <input
              ref="inputOrderConsolidated"
              type="file"
              class="form-control-file"
              accept=".pdf"
              @change="onOrderConsolidatedFileChange"
            />
          </div>
          <button
            type="button"
            class="btn btn-success"
            @click="onOrderConsolidatedSendClick"
          >
            <i class="fas fa-upload"></i> Enviar
          </button>
        </div>
      </div>
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
        orderConsolidatedFile: null,
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
      onOrderConsolidatedFileChange(event) {
        const files = event.target.files;
        if (files.length > 0) {
          this.orderConsolidatedFile = event.target.files[0];
        } else {
          this.orderConsolidatedFile = null;
        }
      },
      onOrderConsolidatedSendClick() {
        // if (!this.orderConsolidatedFile) {
        //   this.notify_warning('Selecione um arquivo.');
        //   return;
        // }
        let formData = new FormData();
        formData.append('file', this.orderConsolidatedFile);
        this.api_loadingShow();
        axios
          .post(`/api/admin/maintenance/importOrderConsolidated`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(
            this.api_thenDone(res => {
              this.$refs.inputOrderConsolidated.value = null;
            })
          )
          .catch(this.api_catch());
      },
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Importação de dados');
    },
  };
</script>

<style scoped></style>
