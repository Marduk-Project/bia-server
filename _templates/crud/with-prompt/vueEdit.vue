---
to: front/js/components/resources/<%= name %>/<%= modelCamelNameUpper %>Edit.vue
---
<template>
  <div v-if="entity" class="container-fluid">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <br />
    <h1>{{ crud_title }}</h1>
    <form action @submit.prevent novalidate>
      <div class="form-row">
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName) { -%>
<% if (!field.isParentId) { -%>
        <div class="form-group col-lg-6">
          <label><%= field.camelNameNoId %></label>
          <app-<%= field.camelNameNoId %>-select v-model="entity.<%= field.camelNameNoId %>"></app-<%= field.camelNameNoId %>-select>
<% if (field.required) { -%>
          <small class="text-danger" v-if="!entity.<%= field.camelNameNoId %>">Campo obrigatório.</small>
<% } -%>
        </div>
<% } -%>
<% } else if (field.name != 'id' && field.name != 'createdAt' && field.name != 'updatedAt') { -%>
<% if (field.type == 'string') { -%>
        <div class="form-group col-lg-6">
          <label><%= field.name %></label>
          <input
            class="form-control"
            name="<%= field.name %>"
            type="text"
            v-model="entity.<%= field.name %>"
            maxlength="60"
<% if (field.required) { -%>
            v-validate="'required'"
            :class="{ 'is-invalid':errors.has('<%= field.name %>') }"
<% } -%>
          />
<% if (field.required) { -%>
          <div class="invalid-feedback">Campo obrigatório.</div>
<% } -%>
        </div>
<% } -%>
<% if (field.type == 'int') { -%>
        <div class="form-group col-lg-3">
          <label><%= field.name %></label>
          <input
            class="form-control"
            name="<%= field.name %>"
            type="numeric"
            step="1"
            v-model="entity.<%= field.name %>"
<% if (field.required) { -%>
            v-validate="'required'"
            :class="{ 'is-invalid':errors.has('<%= field.name %>') }"
<% } -%>
          />
<% if (field.required) { -%>
          <div class="invalid-feedback">Campo obrigatório.</div>
<% } -%>
        </div>
<% } -%>
<% if (field.type == 'double') { -%>
        <div class="form-group col-lg-3">
          <label><%= field.name %></label>
          <input
            class="form-control"
            name="<%= field.name %>"
            type="numeric"
            step="0.01"
            v-model="entity.<%= field.name %>"
<% if (field.required) { -%>
            v-validate="'required'"
            :class="{ 'is-invalid':errors.has('<%= field.name %>') }"
<% } -%>
          />
<% if (field.required) { -%>
          <div class="invalid-feedback">Campo obrigatório.</div>
<% } -%>
        </div>
<% } -%>
<% if (field.type == 'datetime') { -%>
        <div class="form-group col-lg-3">
          <label><%= field.name %></label>
          <app-input-datetime
            name="<%= field.name %>"
            class="form-control"
            v-model="entity.<%= field.name %>"
<% if (field.required) { -%>
            v-validate="'required'"
            :class="{ 'is-invalid':errors.has('<%= field.name %>') }"
<% } -%>
          />
<% if (field.required) { -%>
          <div class="invalid-feedback">Campo obrigatório.</div>
<% } -%>
        </div>
<% } -%>
<% if (field.type == 'boolean') { -%>
      <div class="form-group col-lg-12">
        <div class="form-check">
          <label
            class="form-check-label"
          >
            <input
              class="form-check-input"
              type="checkbox"
              value="1"
              v-model="entity.<%= field.name %>"
            />
            <%= field.name %>.
          </label>
        </div>
      </div>
<% } -%>
<% } -%>
<% }); -%>
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
import { crudMixin } from "../../../libs/mixins/crud-mixin";
import axios from "../../../libs/mixins/axios-auth";

<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName && !field.isParentId) { -%>
import <%= field.camelNameUpperNoId %>Select from "../<%= field.modelName %>/<%= field.camelNameUpperNoId %>Select.vue";
<% } -%>
<% }); -%>

export default {
  mixins: [crudMixin],
  components: {
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName && !field.isParentId) { -%>
    'app-<%= field.camelNameNoId %>-select': <%= field.camelNameUpperNoId %>Select,
<% } -%>
<% }); -%>
  },
  data() {
    return {
      entity: {
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.type == 'boolean') { -%>
        <%= field.name %>: false,
<% } else { -%>
        <%= field.name %>: null,
<% } -%>
<% }); -%>
        // objects
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName) { -%>
        <%= field.camelNameNoId %>: null,
<% } -%>
<% }); -%>
      }
    };
  },
  methods: {
    crud_data() {
      return {
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.type == 'boolean') { -%>
        <%= field.name %>: !!this.entity.<%= field.name %>,
<% } else { -%>
<% if (field.modelName) { -%>
<% if (field.isParentId) { -%>
        <%= field.name %>: this.parentEntityId,
<% } else { -%>
        <%= field.name %>: this.entity.<%= field.camelNameNoId %>
          ? this.entity.<%= field.camelNameNoId %>.id
          : null,
<% } -%>
<% } else { -%>
        <%= field.name %>: this.entity.<%= field.name %>,
<% } -%>
<% } -%>
<% }); -%>
      };
    },
    crud_validate() {
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName && field.required && !field.isParentId) { -%>
      if (!this.entity.<%= field.camelNameNoId %>) {
        this.notify_warning("Selecione <%= field.camelNameNoId %>.");
        return false;
      }
<% } -%>
<% }); -%>
      return true;
    },
<% if (crud_parentName) { -%>
    crud_requestParentEntity() {
      return axios.get(`/api/<%= crud_context %>/<%= crud_parentName %>/${this.parentEntityId}/edit`);
    },
<% } -%>
  },
  computed: {
    crud_title() {
      var ok = this.entity != null;
      if (ok) {
        ok = this.entity.name != null;
      }
      if (ok) {
        return "" + this.entity.name;
      } else {
        return "Cadastro de <%= name %>";
      }
    },
    crud_url_base() {
      return "/api/<%= crud_context %>/<%= name %>";
    },
    crud_route_base() {
      return "<%= name %>";
    }
  }
};
</script>

<style scoped>
</style>
