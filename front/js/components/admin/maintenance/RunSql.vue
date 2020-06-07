<template>
  <div>
    <br />
    <h1>Executar SQL</h1>
    <p class="text-danger">
      <strong>Atenção!</strong> Comandos errados podem fazer o sistema parar de
      funcionar. <br />
    </p>
    <h4>Comando</h4>
    <div class="form-group">
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
    <br />
    <h4>Resultado</h4>
    <pre class="card card-body">{{ sqlResult }}</pre>
    <br />
    <div class="d-flex flex-row">
      <button type="submit" class="btn btn-success" @click="onSendClick">
        <i class="fas fa-terminal"></i> Executar
      </button>
      <div class="col-1"></div>
      <router-link to="/dashboard" class="btn btn-outline-secondary">
        <i class="fas fa-close"></i> Voltar
      </router-link>
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
        sqlCommand: '',
        sqlResult: '',
      };
    },
    methods: {
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
            .then(
              this.api_thenDone(res => {
                this.sqlResult = res.data.results;
              })
            )
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
