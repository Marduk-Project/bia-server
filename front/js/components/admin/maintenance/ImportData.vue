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
      <div class="card-header"> Importar <strong>Entidades</strong> </div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group col-12">
            <label>Selecionar arquivo</label>
            <input
              ref="inputPersonFile"
              type="file"
              class="form-control-file"
              accept=".json"
              @change="onPersonFileChange"
            />
          </div>
          <button
            type="button"
            class="btn btn-success"
            @click="onPersonSendClick"
          >
            <i class="fas fa-upload"></i> Enviar
          </button>
        </div>
      </div>
    </div>
    <br />
    <div class="card">
      <div class="card-header"> Importar <strong>Solicitações</strong> </div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group col-12">
            <label>Selecionar arquivo</label>
            <input
              ref="inputOrderRequest"
              type="file"
              class="form-control-file"
              accept=".json"
              @change="onOrderRequestFileChange"
            />
          </div>
          <button
            type="button"
            class="btn btn-success"
            @click="onOrderRequestSendClick"
          >
            <i class="fas fa-upload"></i> Enviar
          </button>
        </div>
      </div>
    </div>
    <br />
    <div class="card">
      <div class="card-header"> Importar <strong>Entregas</strong> </div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group col-12">
            <label>Selecionar arquivo</label>
            <input
              ref="inputOrderSupply"
              type="file"
              class="form-control-file"
              accept=".json"
              @change="onOrderSupplyFileChange"
            />
          </div>
          <button
            type="button"
            class="btn btn-success"
            @click="onOrderSupplySendClick"
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
        orderRequestFile: null,
        orderSupplyFile: null,
        personFile: null,
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
      onPersonFileChange(event) {
        const files = event.target.files;
        if (files.length > 0) {
          this.personFile = event.target.files[0];
        } else {
          this.personFile = null;
        }
      },
      onPersonSendClick() {
        if (!this.personFile) {
          this.notify_warning('Selecione um arquivo.');
          return;
        }
        let formData = new FormData();
        formData.append('file', this.personFile);
        this.api_loadingShow();
        axios
          .post(`/api/admin/maintenance/personImport`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(
            this.api_thenDone(res => {
              this.$refs.inputPersonFile.value = null;
            })
          )
          .catch(this.api_catch());
      },
      onOrderRequestFileChange(event) {
        const files = event.target.files;
        if (files.length > 0) {
          this.orderRequestFile = event.target.files[0];
        } else {
          this.orderRequestFile = null;
        }
      },
      onOrderRequestSendClick() {
        if (!this.orderRequestFile) {
          this.notify_warning('Selecione um arquivo.');
          return;
        }
        let formData = new FormData();
        formData.append('file', this.orderRequestFile);
        this.api_loadingShow();
        axios
          .post(`/api/admin/maintenance/orderRequestImport`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(
            this.api_thenDone(res => {
              this.$refs.inputOrderRequest.value = null;
            })
          )
          .catch(this.api_catch());
      },
      onOrderSupplyFileChange(event) {
        const files = event.target.files;
        if (files.length > 0) {
          this.orderSupplyFile = event.target.files[0];
        } else {
          this.orderSupplyFile = null;
        }
      },
      onOrderSupplySendClick() {
        if (!this.orderSupplyFile) {
          this.notify_warning('Selecione um arquivo.');
          return;
        }
        let formData = new FormData();
        formData.append('file', this.orderSupplyFile);
        this.api_loadingShow();
        axios
          .post(`/api/admin/maintenance/orderSupplyImport`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(
            this.api_thenDone(res => {
              this.$refs.inputOrderSupply.value = null;
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
