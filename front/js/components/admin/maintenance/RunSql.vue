<template>
  <div>
    <br />
    <h1>Executar SQL</h1>
    <p class="text-danger">
      <strong>Atenção!</strong> Comandos errados podem fazer o sistema parar de
      funcionar. <br />
    </p>
    <h4>Comando</h4>
    <div class="form-row">
      <div class="form-group col-12">
        <textarea
          class="form-control"
          rows="3"
          name="sqlCommand"
          v-model="sqlCommand"
          v-validate="'required'"
          :class="{ 'is-invalid': errors.has('sqlCommand') }"
        ></textarea>
        <div class="invalid-feedback">
          Campo obrigatório.
        </div>
      </div>
      <div class="form-group col-lg-2">
        <button
          type="submit"
          class="btn btn-success w-100"
          @click="onSendClick"
        >
          <i class="fas fa-terminal"></i> Executar
        </button>
      </div>
      <div class="form-group col-lg-2 offset-lg-1">
        <button
          @click="onClearClick"
          type="button"
          to="/dashboard"
          class="btn btn-outline-secondary w-100"
        >
          <i class="fas fa-eraser"></i> Limpar
        </button>
      </div>
      <div class="form-group col-lg-2">
        <router-link to="/dashboard" class="btn btn-outline-secondary w-100">
          <i class="fas fa-times"></i> Voltar
        </router-link>
      </div>
    </div>
    <br />
    <h4>Resultado</h4>
    <pre class="card card-body">{{ sqlResult }}</pre>
    <br />
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  import { apiMixin } from '@mixins/api-mixin';

  export default {
    mixins: [apiMixin],
    data() {
      return {
        sqlCommand: '',
        sqlResult: '',
      };
    },
    methods: {
      onClearClick() {
        this.sqlResult = '';
      },
      onSendClick() {
        this.$validator.validate().then(result => {
          if (!result) {
            return;
          }
          if (!this.sqlCommand) {
            return;
          }
          if (!confirm('Executar comando?')) {
            return;
          }
          this.api_loadingShow();
          axios
            .post('api/admin/maintenance/runSql', {
              sqlCommand: this.sqlCommand,
            })
            .then(res => {
              this.sqlResult = res.data.results;
              this.api_loadingHide();
            })
            .catch(this.api_catch());
        });
      },
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Executar SQL');
    },
  };
</script>

<style scoped></style>
