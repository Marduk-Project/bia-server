<template>
  <div v-if="entity" class="container-fluid">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <br />
    <h1>{{ crud_title }}</h1>
    <!--
      todo verify
    <div v-if="entity.id != null">
      <router-link
        class="btn btn-outline-secondary"
        tag="button"
        :to="{ name: 'gl_person_contact.index', params: { parentEntityId: entity.id, parentEntity: entity, origin: 'p' } }"
      >
        <i class="fa fa-user"></i> Verificações
      </router-link>
      <br />
      <br />
    </div>
    -->
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-lg-12">
          <label>Nome</label>
          <input
            class="form-control"
            name="name"
            type="text"
            v-model="entity.name"
            placeholder="ex. Fulano Ciclano Tal"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Telefone fixo</label>
          <input
            name="phone"
            type="text"
            v-mask="['(##) ####-####', '(##) #####-####', '(###) #####-####']"
            class="form-control"
            v-model="entity.phone"
            placeholder="ex. (51) 1234-5678"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>Telefone celular</label>
          <input
            type="text"
            name="cellphone"
            v-mask="['(##) ####-####', '(##) #####-####', '(###) #####-####']"
            class="form-control"
            v-model="entity.cellphone"
            placeholder="ex. (51) 12345-6789"
          />
        </div>
        <div class="form-group col-lg-6">
          <label>E-mail</label>
          <input
            name="email"
            type="email"
            class="form-control"
            v-model="entity.email"
            placeholder="ex. contato@exemplo.com.br"
            v-validate="'email'"
            :class="{ 'is-invalid': errors.has('email') }"
          />
          <div class="invalid-feedback">Campo deve ser um e-mail.</div>
        </div>
        <div class="form-group col-lg-6" v-if="origin != 'u'">
          <label>Usuário</label>
          <app-user-select v-model="entity.user"></app-user-select>
        </div>
        <div class="form-group col-lg-6" v-if="origin != 'p'">
          <label>Pessoa</label>
          <app-person-select v-model="entity.person"></app-person-select>
          <small>
            Cadastro de
            <strong>Pessoa</strong> que pertence este contato.
          </small>
          <small class="text-danger" v-if="!entity.person"
            >Campo obrigatório.</small
          >
        </div>
        <div class="form-group col-lg-6">
          <label>Pessoa referência</label>
          <app-person-select
            v-model="entity.personReference"
          ></app-person-select>
          <small>Cadastro completo deste contato, caso necessário.</small>
        </div>
        <div class="form-group col-12">
          <label>Observações</label>
          <textarea
            rows="4"
            v-model="entity.obs"
            class="form-control"
          ></textarea>
        </div>
      </div>
      <br />
      <h4>Regras</h4>
      <div class="form-row">
        <div class="form-group col-12">
          <div class="form-check">
            <label
              class="form-check-label"
              :class="{ 'text-success': entity.trusted }"
              v-b-tooltip.hover
              title="Foi validado por algum outro usuário confiável. Você não pode alterar esta informação aqui."
            >
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                disabled
                v-model="entity.trusted"
              />
              Possui identidade verificada.
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                v-model="entity.canRegisterPPERequest"
              />
              Pode criar solicitação de EPI.
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
      <app-entitybaseinfo :entity="entity"></app-entitybaseinfo>
    </form>
  </div>
</template>

<script>
import { crudMixin } from "@mixins/crud-mixin";
import axios from "@mixins/axios-auth";
import PersonSelect from "@resources/gl_person/PersonSelect.vue";
import UserSelect from "@resources/gl_user/UserSelect.vue";

export default {
  mixins: [crudMixin],
  components: {
    "app-person-select": PersonSelect,
    "app-user-select": UserSelect,
  },
  data() {
    return {
      entity: {
        id: null,
        name: null,
        cityId: null,
        email: null,
        cellphone: null,
        phone: null,
        trusted: false,
        obs: null,
        level: 10, // todo fixed now
        canRegisterPPERequest: false,
        personId: null,
        personReferenceId: null,
        userId: null,
        // objects
        person: null,
        personReference: null,
        user: null,
      },
    };
  },
  methods: {
    crud_data() {
      return {
        id: this.entity.id,
        name: this.entity.name,
        email: this.entity.email,
        cellphone: this.entity.cellphone,
        phone: this.entity.phone,
        obs: this.entity.obs,
        level: this.entity.level,
        canRegisterPPERequest: this.entity.canRegisterPPERequest,
        personReferenceId: this.entity.personReference
          ? this.entity.personReference.id
          : null,
        userId:
          this.origin == "u"
            ? this.parentEntityId
            : this.entity.user
            ? this.entity.user.id
            : null,
        personId:
          this.origin == "p"
            ? this.parentEntityId
            : this.entity.person
            ? this.entity.person.id
            : null,
      };
    },
    crud_validate() {
      if (this.origin == "u") {
        if (!this.entity.person) {
          this.notify_warning("Selecione uma pessoa para vicular o contato.");
          return false;
        }
      }
      return true;
    },
  },
  computed: {
    origin() {
      return this.$route.params.origin;
    },
    crud_title() {
      var ok = this.entity != null;
      if (ok) {
        ok = this.entity.name != null;
      }
      if (ok) {
        return "" + this.entity.name;
      } else {
        return "Cadastro de Contato";
      }
    },
    crud_url_base() {
      return "/api/admin/gl_person_contact";
    },
    crud_route_base() {
      return "gl_person_contact";
    },
  },
};
</script>

<style scoped></style>
