<template>
  <div v-if="entity" class="container-fluid">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <h1>{{ crud_title }}</h1>
    <div v-if="entity.id != null">
      <router-link
        class="btn btn-outline-secondary"
        tag="button"
        :to="{ name: 'gl_person_contact.index', params: { parentEntityId: entity.id, parentEntity: entity, origin: 'u' } }"
      >
        <i class="fa fa-building"></i> Contatos vinculados
      </router-link>
      <br />
      <br />
    </div>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-lg-6">
          <label>Nome</label>
          <input
            name="name"
            placeholder="ex. John Eduard"
            class="form-control"
            type="text"
            v-model="entity.name"
            v-validate="'required'"
            maxlength="100"
            :class="{ 'is-invalid': errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Apelido</label>
          <input
            name="nickname"
            placeholder="ex. John"
            class="form-control"
            type="text"
            v-model="entity.nickname"
            v-validate="'required'"
            maxlength="100"
            :class="{ 'is-invalid': errors.has('nickname') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Nível</label>
          <app-user-level-select v-model="entity.level"></app-user-level-select>
        </div>
        <div class="form-group col-lg-6">
          <label>E-mail</label>
          <input
            name="email"
            placeholder="email"
            class="form-control"
            type="text"
            v-model="entity.email"
            v-validate="'required|email'"
            maxlength="60"
            :class="{ 'is-invalid': errors.has('email') }"
          />
          <div class="invalid-feedback">E-mail é obrigatório.</div>
        </div>
      </div>
      <br />
      <h4>Regras</h4>
      <div class="form-row">
        <div class="form-group col-12">
          <div class="form-check">
            <label class="form-check-label" :class="{ 'text-danger': entity.blocked }">
              <input class="form-check-input" type="checkbox" value="1" v-model="entity.blocked" />
              Bloqueado / inativo
            </label>
          </div>
        </div>
      </div>
      <br />
      <div class="form-row">
        <app-crud-buttons
          @onSave="crud_onSaveAction"
          @onDelete="crud_onDeleteAction"
          :delete-show="entity.id != null"
        ></app-crud-buttons>
      </div>
      <br />
      <div class="card" v-if="entity.id">
        <div class="card-header">Sistema</div>
        <div class="card-body">
          <h4>Senha</h4>
          <div class="form-row">
            <div class="form-group col-lg-3">
              <label>Testar senha</label>
              <div class="input-group">
                <input
                  name="pwd_check"
                  v-model="pwd_check"
                  class="form-control"
                  type="password"
                  minlength="6"
                  placeholder="senha atual"
                  @keyup.enter.prevent="onPwdCheckClick"
                />
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button" @click="onPwdCheckClick">
                    <i class="fa fa-user-secret"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-3">
              <label>Alterar senha</label>
              <div class="input-group">
                <input
                  name="pwd_change"
                  v-model="pwd_change"
                  class="form-control"
                  type="password"
                  minlength="6"
                  placeholder="nova senha"
                  @keyup.enter.prevent="onPwdChangeClick"
                />
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button" @click="onPwdChangeClick">
                    <i class="fa fa-key"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-3">
              <label>&nbsp;</label>
              <button class="btn btn-outline-secondary w-100" @click="onPwdRecoverClick">
                <i class="fas fa-envelope"></i> Enviar recuperação
              </button>
            </div>
            <div class="form-group col-lg-3">
              <label>&nbsp;</label>
              <button class="btn btn-outline-secondary w-100" @click="onPwdInviteClick">
                <i class="fas fa-handshake"></i> Enviar convite
              </button>
            </div>
          </div>
        </div>
      </div>
      <app-entitybaseinfo :entity="entity"></app-entitybaseinfo>
    </form>
  </div>
</template>

<script>
import { crudMixin } from "../../../libs/mixins/crud-mixin";
import axios from "../../../libs/mixins/axios-auth";
import UserLevelSelect from "./UserLevelSelect.vue";
import _ from "lodash";

export default {
  mixins: [crudMixin],
  components: {
    "app-user-level-select": UserLevelSelect
  },
  data() {
    return {
      entity: {
        id: null,
        name: null,
        nickname: null,
        email: null,
        level: 10,
        blocked: false,
        accounts: []
      },
      pwd_change: null,
      pwd_check: null
    };
  },
  methods: {
    crud_data() {
      return {
        id: this.entity.id,
        name: this.entity.name,
        nickname: this.entity.nickname,
        email: this.entity.email,
        level: this.entity.level,
        blocked: this.entity.blocked ? true : false
      };
    },
    crud_shouldNavBackAfterSave() {
      return false;
    },
    onPwdCheckClick() {
      if (!this.pwd_check) {
        this.notify_warning("Digite a senha.");
        return;
      }
      this.api_loadingShow();
      const data = {
        pwd: this.pwd_check
      };
      axios
        .post(`/api/admin/gl_user/${this.entity.id}/pwd_check`, data)
        .then(
          this.api_thenDone(() => {
            this.pwd_check = null;
          })
        )
        .catch(this.api_catch());
    },
    onPwdChangeClick() {
      if (!this.pwd_change) {
        this.notify_warning("Digite a senha.");
        return;
      }
      if (confirm("Alterar senha deste usuário?")) {
        this.api_loadingShow();
        const data = {
          pwd: this.pwd_change
        };
        axios
          .post(`/api/admin/gl_user/${this.entity.id}/pwd_change`, data)
          .then(
            this.api_thenDone(() => {
              this.pwd_change = null;
            })
          )
          .catch(this.api_catch());
      }
    },
    onPwdRecoverAction(isInvite) {
      if (
        confirm(`Enviar e-mail de ${isInvite ? "convite" : "recuperação"}?`)
      ) {
        this.api_loadingShow();
        axios
          .post(`/api/admin/gl_user/${this.entity.id}/pwd_recover`, {
            isInvite: isInvite
          })
          .then(this.api_thenDone())
          .catch(this.api_catch());
      }
    },
    onPwdRecoverClick() {
      this.onPwdRecoverAction(false);
    },
    onPwdInviteClick() {
      this.onPwdRecoverAction(true);
    }
  },
  computed: {
    crud_title() {
      var ok = this.entity != null;
      if (ok) {
        ok = this.entity.name;
      }
      if (ok) {
        return "" + this.entity.name;
      } else {
        return "Cadastro de Usuário";
      }
    },
    crud_url_base() {
      return "/api/admin/gl_user";
    },
    crud_route_base() {
      return "gl_user";
    }
  }
};
</script>

<style scoped>
</style>
