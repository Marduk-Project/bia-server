<template>
  <div class="container">
    <br>
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br>
    <h1>Meus dados</h1>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-md-8">
          <label>Nome</label>
          <input
            class="form-control"
            name="name"
            v-model="entity.name"
            placeholder
            v-validate="'required'"
            data-vv-scope="crud"
            type="text"
            :class="{ 'is-invalid': errors.has('name', 'crud') }"
            maxlength="100"
          >
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-md-4">
          <label>Apelido</label>
          <input
            class="form-control"
            name="nickname"
            v-model="entity.nickname"
            placeholder
            v-validate="'required'"
            data-vv-scope="crud"
            type="text"
            :class="{ 'is-invalid': errors.has('nickname', 'crud') }"
            maxlength="100"
          >
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-md-8">
          <label>E-mail</label>
          <input type="text" class="form-control" :value="entity.email" placeholder readonly>
        </div>
        <div class="form-group col-md-4">
          <label>ID</label>
          <input type="text" class="form-control" :value="entity._id" placeholder readonly>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-5 col-lg-4 col-xl-2">
          <button type="button" class="btn btn-success w-100" @click="crud_onSaveClick">
            <i class="fa fa-check"></i> Salvar
          </button>
        </div>
      </div>
    </form>
    <br>
    <br>
    <h3>Alterar senha</h3>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label>Senha atual</label>
          <input
            class="form-control"
            name="pwd_current"
            v-model="pwd_current"
            v-validate="'required'"
            type="password"
            placeholder
          >
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label>Nova senha</label>
          <b-form-input
            name="pwd_new"
            v-model="pwd_new"
            v-validate="'required'"
            :state="(pwd_error != null) ? false : null"
            type="password"
            placeholder
            aria-describedby="pg-pwd-feedback"
          ></b-form-input>
          <b-form-invalid-feedback id="pg-pwd-feedback">{{ pwd_error }}</b-form-invalid-feedback>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label>Confirme a senha</label>
          <input
            class="form-control"
            name="pwd_conf"
            v-model="pwd_conf"
            v-validate="'required'"
            type="password"
            placeholder
          >
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-5 col-lg-4 col-xl-2">
          <button type="button" class="btn btn-success w-100" @click="onChangePasswordClick">
            <i class="fa fa-key"></i> Alterar
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "../../../libs/mixins/axios-auth";
import { apiMixin } from "../../../libs/mixins/api-mixin";
import { notifyMixin } from "../../../libs/mixins/notify-mixin";
export default {
  mixins: [apiMixin, notifyMixin],
  data() {
    return {
      entity: {
        _id: null,
        name: null,
        nickname: null,
        email: null
      },
      pwd_current: "",
      pwd_new: "",
      pwd_conf: ""
    };
  },
  computed: {
    pwd_error() {
      if (this.pwd_current == "" && this.pwd_new == "" && this.pwd_conf == "") {
        return null;
      }
      if (!this.pwd_current) {
        return "Senha atual em branco.";
      }
      if (!this.pwd_new) {
        return "Nova senha em branco.";
      }
      if (this.pwd_new.length < 6 || this.pwd_new.length > 32) {
        return "Senha precisa ter entre 6 e 32 caracteres.";
      }
      if (!this.pwd_conf) {
        return "Confirme a senha.";
      }
      if (this.pwd_new != this.pwd_conf) {
        return "As senhas não são iguais.";
      }
      return null;
    }
  },
  methods: {
    onChangePasswordClick() {
      if (this.pwd_error) {
        this.notify_danger(this.pwd_error);
        return;
      }
      if (this.pwd_current == "" && this.pwd_new == "" && this.pwd_conf == "") {
        return;
      }
      let data = {
        pwd_current: this.pwd_current,
        pwd_new: this.pwd_new
      };
      this.api_loadingShow();
      axios
        .post("/api/admin/user/me/pwd_update", data)
        .then(
          this.api_thenDone(res => {
            // limpa
            this.pwd_current = "";
            this.pwd_new = "";
            this.pwd_conf = "";
          })
        )
        .catch(this.api_catch());
    },
    crud_refreshEntity() {
      this.api_loadingShow();
      axios
        .get("/api/admin/user/me")
        .then(res => {
          if (!this.api_parseOK(res)) {
            return;
          }
          if (res.data.warnings) {
            this.notify_warning(res.data.warnings);
          }
          this.entity = res.data.data;
          this.api_loadingHide();
        })
        .catch(this.api_catch());
    },
    crud_navBack() {
      this.$router.push({
        name: "dashboard"
      });
    },
    crud_onSaveClick() {
      const validated = this.$validator.validateAll("crud");
      validated.then(result => {
        if (!result) {
          this.crud_onValidateError();
          return;
        }
        this.api_loadingShow();
        let data = {
          name: this.entity.name,
          nickname: this.entity.nickname,
        };
        axios
          .post("/api/admin/user/me/update", data)
          .then(
            this.api_thenDone(res => {
              this.$store.dispatch("loadSession");
            })
          )
          .catch(this.api_catch());
      });
    }
  },
  mounted() {
    this.crud_refreshEntity();
    this.$store.dispatch('setTitle', 'Meus dados');
  }
};
</script>

<style scoped>
</style>
