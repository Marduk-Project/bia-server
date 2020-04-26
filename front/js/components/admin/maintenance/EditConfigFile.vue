<template>
  <div>
    <br />
    <h1>Editar arquivo de configuração</h1>
    <p class="text-danger">
      <strong>Atenção!</strong> Configurações erradas podem fazer o sistema
      parar de funcionar. <br />
      É necessário <strong>reiniciar a instância de aplicação </strong> para as
      configurações terem efeito.
    </p>
    <div class="form-group">
      <textarea
        class="form-control"
        rows="20"
        name="file_content"
        v-model="file_content"
      ></textarea>
    </div>
    <br />
    <div class="d-flex flex-row">
      <button
        type="submit"
        class="btn btn-success"
        :disabled="!wsLoadOK"
        @click="onSaveClick"
      >
        <i class="fas fa-check"></i> Salvar
      </button>
      <div class="col-1"></div>
      <router-link to="/dashboard" class="btn btn-outline-secondary">
        <i class="fas fa-close"></i> Voltar
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "@mixins/axios-auth";
import { apiMixin } from "@mixins/api-mixin";

export default {
  mixins: [apiMixin],
  data() {
    return {
      file_content: "",
      wsLoadOK: false,
    };
  },
  methods: {
    onSaveClick() {
      this.api_loadingShow();
      axios
        .post("api/admin/maintenance/config_update", {
          file_content: this.file_content,
        })
        .then(this.api_thenDone())
        .catch(this.api_catch());
    },
    reloadContent() {
      this.api_loadingShow();
      axios
        .get("api/admin/maintenance/config_get")
        .then((res) => {
          if (!this.api_parseOK(res, false)) {
            return;
          }
          this.file_content = res.data.file_content;
          this.wsLoadOK = true;
          this.api_loadingHide();
        })
        .catch(
          this.api_catch((error) => {
            this.wsLoadOK = false;
          })
        );
    },
  },
  mounted() {
    this.$store.dispatch("setTitle", "Editar config.json");
    this.reloadContent();
  },
};
</script>

<style scoped></style>
