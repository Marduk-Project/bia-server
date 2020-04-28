---
to: front/js/components/resources/<%= name %>/<%= modelCamelNameUpper %>List.vue
---
<template>
  <div class="container-fluid">
<% if (crud_parentName) { -%>
    <br />
    <button
      type="button"
      class="btn btn-link"
      @click="$router.push({ name: '<%= crud_parentName %>.edit', params: { id: parentEntityId } })"
    >
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
<% } -%>
    <br />
    <h1>{{ list_title }}</h1>
    <app-add-button @click="list_onAddClick"></app-add-button>
    <br />
    <br />
    <div class="form-row">
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName && !field.isParentId) { -%>
        <div class="form-group col-lg-6">
          <label><%= field.camelNameNoId %></label>
          <app-<%= field.camelNameNoId %>-select v-model="filters.<%= field.camelNameNoId %>"></app-<%= field.camelNameNoId %>-select>
        </div>
<% } -%>
<% }); -%>
      <div class="form-group col-12">
        <div class="input-group mb-3">
          <input
            type="text"
            v-model="searchText"
            class="form-control"
            placeholder="pesquisar"
            aria-label="pesquisar"
            @keyup.enter="list_refreshCurrentPage"
          />
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="list_refreshCurrentPage">
              <i class="fa fa-search"></i> Filtrar
            </button>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped">
      <thead>
        <tr class>
          <th>#</th>
          <th>Nome</th>
          <!--
          <th class="app-table-actions">
            S.
            <i class="fa fa-info-circle" v-b-tooltip.hover title="Situação"></i>
          </th>
          -->
        </tr>
      </thead>
      <tbody>
        <tr
          style="cursor: pointer;"
          v-for="entity in list.data"
          :key="entity.id"
          @click="list_onItemClick(entity)"
        >
          <td>{{ entity.id }}</td>
          <td>{{ entity.name }}</td>
          <!--
          <td class="app-table-actions">
            <i
              v-b-tooltip.hover
              title="Verificado"
              class="fas fa-check-circle"
              :class="{
              'app-table-action-disabled': !entity.trusted,
              'text-success': entity.trusted,
            }"
            ></i>
          </td>
          -->
        </tr>
      </tbody>
    </table>
    <app-pagination :pagination="list" @paginate="list_refreshPage($event)" />
  </div>
</template>

<script>
import { listMixin } from "@mixins/list-mixin";
import axios from "@mixins/axios-auth";
import _ from "lodash";

<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName && !field.isParentId) { -%>
import <%= field.camelNameUpperNoId %>Select from "../<%= field.modelName %>/<%= field.camelNameUpperNoId %>Select.vue";
<% } -%>
<% }); -%>

export default {
  mixins: [listMixin],
  components: {
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName && !field.isParentId) { -%>
    'app-<%= field.camelNameNoId %>-select': <%= field.camelNameUpperNoId %>Select,
<% } -%>
<% }); -%>
  },
  data() {
    return {
      filters: {
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName && !field.isParentId) { -%>
        <%= field.camelNameNoId %>: null,
<% } -%>
<% }); -%>
      }
    };
  },
  computed: {
    list_title() {
      return "Título <%= name %>";
    },
    list_url_base() {
      return "/api/<%= crud_context %>/<%= name %>";
    },
    list_route_base() {
      return "<%= name %>";
    },
  },
  methods: {
    list_buildURL(page) {
      let url = `${this.list_url_base}?page=${page}&q=${encodeURIComponent(
        this.searchText
      )}`;
<% crud_fieldObjects.forEach(function(field) { -%>
<% if (field.modelName) { -%>
<% if (field.isParentId) { -%>
      url += `&<%= field.name %>=${this.parentEntityId}`;
<% } else { -%>
<% if (field.required) { -%>
      if (this.filters.<%= field.camelNameNoId %>) {
        url += `&<%= field.name %>=${this.filters.<%= field.camelNameNoId %>.id}`;
      }
<% } else { -%>
      if (this.filters.<%= field.camelNameNoId %>) {
        url += `&<%= field.name %>=${this.filters.<%= field.camelNameNoId %>.id}`;
      }
<% } -%>
<% } -%>
<% } -%>
<% }); -%>
      return url;
    },
<% if (crud_parentName) { -%>
    list_requestParentEntity() {
      return axios.get(`/api/<%= crud_context %>/<%= crud_parentName %>/${this.parentEntityId}/edit`);
    }
<% } -%>
  }
};
</script>

<style scoped>
</style>
