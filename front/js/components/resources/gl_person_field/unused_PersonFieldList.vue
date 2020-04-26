<template>
  <div class="container-fluid">
    <br />
    <button
      type="button"
      class="btn btn-link"
      @click="
        $router.push({ name: 'gl_person.edit', params: { id: parentEntityId } })
      "
    >
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <h1>{{ list_title }}</h1>
    <app-add-button @click="list_onAddClick"></app-add-button>
    <br />
    <br />
    <div class="form-row">
      <div class="form-group col-lg-6">
        <label>field</label>
        <app-field-select v-model="filters.field"></app-field-select>
      </div>
      <div class="form-group col-lg-6">
        <label>fieldItem</label>
        <app-fieldItem-select
          v-model="filters.fieldItem"
        ></app-fieldItem-select>
      </div>
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
            <button
              class="btn btn-primary"
              type="button"
              @click="list_refreshCurrentPage"
            >
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
          <th class="app-table-actions">
            S.
            <i class="fa fa-info-circle" v-b-tooltip.hover title="Situação"></i>
          </th>
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

import FieldSelect from "../gl_field/FieldSelect.vue";
import FieldItemSelect from "../gl_field_item/FieldItemSelect.vue";

export default {
  mixins: [listMixin],
  components: {
    "app-field-select": FieldSelect,
    "app-fieldItem-select": FieldItemSelect,
  },
  data() {
    return {
      filters: {
        field: null,
        fieldItem: null,
      },
    };
  },
  computed: {
    list_title() {
      return "Título gl_person_field";
    },
    list_url_base() {
      return "/api/admin/gl_person_field";
    },
    list_route_base() {
      return "gl_person_field";
    },
  },
  methods: {
    list_buildURL(page) {
      let url = `${this.list_url_base}?page=${page}&q=${encodeURIComponent(
        this.searchText
      )}`;
      if (this.filters.field) {
        url += `&fieldId=${this.filters.field.id}`;
      }
      if (this.filters.fieldItem) {
        url += `&fieldItemId=${this.filters.fieldItem.id}`;
      }
      url += `&personId=${this.parentEntityId}`;
      return url;
    },
    list_requestParentEntity() {
      return axios.get(`/api/admin/gl_person/${this.parentEntityId}/edit`);
    },
  },
};
</script>

<style scoped></style>
