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
            class="form-control"
            name="name"
            type="text"
            v-model="entity.name"
            maxlength="60"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Ordem</label>
          <input
            class="form-control"
            name="order"
            type="numeric"
            step="1"
            v-model="entity.order"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>Valor</label>
          <input
            class="form-control"
            name="valueString"
            type="text"
            v-model="entity.valueString"
            maxlength="60"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
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
import { crudMixin } from '@mixins/crud-mixin';
import axios from '@mixins/axios-auth';

export default {
  mixins: [crudMixin],
  data() {
    return {
      entity: {
        fieldId: null,
        name: null,
        code: null,
        order: 0,
        valueString: null,
        // objects
        field: null,
      },
    };
  },
  methods: {
    crud_data() {
      return {
        fieldId: this.parentEntityId,
        name: this.entity.name,
        code: this.entity.code,
        order: this.entity.order,
        valueString: this.entity.valueString,
      };
    },
    crud_validate() {
      return true;
    },
    crud_requestParentEntity() {
      return axios.get(`/api/admin/gl_field/${this.parentEntityId}/edit`);
    },
  },
  computed: {
    crud_title() {
      var ok = this.entity != null;
      if (ok) {
        ok = this.entity.name != null;
      }
      if (ok) {
        return '' + this.entity.name;
      } else {
        return 'Cadastro de Item';
      }
    },
    crud_url_base() {
      return '/api/admin/gl_field_item';
    },
    crud_route_base() {
      return 'gl_field_item';
    },
  },
};
</script>

<style scoped></style>
