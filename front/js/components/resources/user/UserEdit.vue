<template>
  <div v-if="entity" class="container">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <h1>{{ crud_title }}</h1>
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
      <h4>Contas vinculadas</h4>
      <div class="form-row">
        <div class="form-group col-lg-6">
          <label>Conta</label>
          <app-account-select v-model="accountEntity.account_id"></app-account-select>
        </div>
        <div class="form-group col-lg-3">
          <label>Nível</label>
          <app-account-level-select v-model="accountEntity.level"></app-account-level-select>
        </div>
        <div class="form-group col-lg-3">
          <label>&nbsp;</label>
          <button class="btn btn-outline-success w-100" type="button" @click="account_onAddClick">
            <i
              class="fas"
              :class="{ 'fa-plus': accountEntity.new, 'fa-check': !accountEntity.new } "
            ></i>
            {{ accountEntity.new ? 'Adicionar' : 'Alterar' }}
          </button>
        </div>
      </div>
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th>Conta</th>
            <th>Nível na conta</th>
            <th class="app-table-actions">
              A.
              <app-info title="Ações"></app-info>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            style="cursor: pointer"
            v-for="account in entity.accounts"
            :key="account.mid"
            @click="account_onItemClick(account)"
            :class="{ 'table-active': account_isItemSelected(account) }"
          >
            <td>{{ account.account_id.name }}</td>
            <td>{{ account.level_desc ? account.level_desc : account_levelToDesc(account.level) }}</td>
            <td class="app-table-actions">
              <i
                @click.stop="account_onDeleteClick(account)"
                class="fas fa-trash text-danger app-table-action"
                v-b-tooltip.hover
                title="Excluir"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <div class="form-row">
        <app-crud-buttons
          @onSave="crud_onSaveAction"
          @onDelete="crud_onDeleteAction"
          :delete-show="entity._id != null"
        ></app-crud-buttons>
      </div>
      <br />
      <div class="card" v-if="entity._id">
        <div class="card-header">Sistema</div>
        <div class="card-body">
          <h4>Senha</h4>
          <div class="form-row">
            <div class="form-group col-lg-4">
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
            <div class="form-group col-lg-4">
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
        _id: null,
        name: null,
        nickname: null,
        email: null,
        level: 5,
        blocked: false,
        accounts: []
      },
      pwd_change: null,
      pwd_check: null,
      accountEntity: this.account_makeNew()
    };
  },
  methods: {
    crud_data() {
      return {
        _id: this.entity._id,
        name: this.entity.name,
        nickname: this.entity.nickname,
        email: this.entity.email,
        level: this.entity.level,
        blocked: this.entity.blocked ? true : false,
        accounts: this.entity.accounts.map(el => {
          return {
            _id: el._id,
            mid: el.mid,
            account_id: el.account_id._id,
            level: el.level
          };
        })
      };
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
        .post(`/api/admin/user/${this.entity._id}/pwd_check`, data)
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
          .post(`/api/admin/user/${this.entity._id}/pwd_change`, data)
          .then(
            this.api_thenDone(() => {
              this.pwd_change = null;
            })
          )
          .catch(this.api_catch());
      }
    },
    crud_shouldNavBackAfterSave() {
      return false;
    },
    account_onDeleteClick(item) {
      if (confirm("Excluir registro?")) {
        let list = this.entity.accounts;
        list = this.entity.accounts.filter(el => {
          return el.mid != item.mid;
        });
        // clear selected
        this.accountEntity = this.account_makeNew();
        // upd
        this.$set(this.entity, "accounts", list);
      }
    },
    account_onItemClick(account) {
      if (this.account_isItemSelected(account)) {
        this.accountEntity = this.account_makeNew();
      } else {
        this.accountEntity = _.cloneDeep(account);
      }
    },
    account_isItemSelected(item) {
      return this.accountEntity.mid == item.mid && !this.accountEntity.new;
    },
    account_onAddClick() {
      if (!this.accountEntity.account_id) {
        this.notify_warning("Selecione uma conta.");
        return;
      }
      // if already exist and not new
      if (this.accountEntity.new) {
        if (
          this.entity.accounts.find(el => {
            return el.account_id._id == this.accountEntity.account_id._id;
          })
        ) {
          this.notify_warning("Usuário já está vinculado com esta conta.");
          return;
        }
      }
      const item = {
        mid: this.accountEntity.mid,
        account_id: this.accountEntity.account_id,
        level: this.accountEntity.level
      };
      let list = this.entity.accounts;
      if (this.accountEntity.new) {
        list.push(item);
      } else {
        list = list.map(el => {
          return el.mid == item.mid ? item : el;
        });
      }
      this.$set(this.entity, "accounts", list);
      this.accountEntity = this.account_makeNew();
    },
    account_makeNew() {
      return {
        new: true,
        mid: new Date().getTime(),
        account_id: null,
        level: 20
      };
    },
    account_levelToDesc(level) {
      switch (parseInt(level)) {
        case 10:
          return "Administrador";

        case 15:
          return "Gestor";

        case 20:
          return "Usuário";
      }
      return "Desconhecido";
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
      return "/api/admin/user";
    },
    crud_route_base() {
      return "user";
    }
  }
};
</script>

<style scoped>
</style>
