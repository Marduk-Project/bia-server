<template>
  <div v-if="entity" class="container-fluid">
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
            placeholder="nome"
            class="form-control"
            type="text"
            v-model="entity.name"
            v-validate="'required'"
            maxlength="60"
            :class="{ 'is-invalid': errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Sigla</label>
          <input
            name="code"
            placeholder="sigla"
            class="form-control"
            type="text"
            v-model="entity.code"
            maxlength="10"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>Prioridade</label>
          <input
            name="priority"
            placeholder="prioridade"
            class="form-control"
            type="number"
            v-model="entity.priority"
            maxlength="1"
          />
        </div>
        <div class="form-group col-lg-6">
          <label>País</label>
          <app-country-select v-model="entity.country"></app-country-select>
          <small class="text-danger" v-if="!entity.country"
            >Campo obrigatório.</small
          >
        </div>
      </div>
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
import { crudMixin } from "../../../libs/mixins/crud-mixin";
import CountrySelect from "../gl_country/CountrySelect.vue";

export default {
  mixins: [crudMixin],
  components: {
    "app-country-select": CountrySelect,
  },
  data() {
    return {
      entity: {
        id: null,
        name: null,
        code: null,
        priority: 0,
        countryId: null,
        // objects
        country: null,
      },
    };
  },
  methods: {
    crud_data() {
      return {
        id: this.entity.id,
        name: this.entity.name,
        code: this.entity.code,
        priority: this.entity.priority,
        countryId: this.entity.country ? this.entity.country.id : null,
      };
    },
    crud_validate() {
      if (!this.entity.country) {
        this.notify_warning("Selecione um País.");
        return false;
      }
      return true;
    },
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
        return "Cadastro de Estado";
      }
    },
    crud_url_base() {
      return "/api/admin/gl_state";
    },
    crud_route_base() {
      return "gl_state";
    },
  },
};
</script>

<style scoped></style>
