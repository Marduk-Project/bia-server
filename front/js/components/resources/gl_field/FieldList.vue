<template>
  <div class="container-fluid">
    <br />
    <h1>{{ list_title }}</h1>
    <app-add-button @click="list_onAddClick"></app-add-button>
    <br />
    <br />
    <div class="form-row">
      <div class="form-group col-lg-6">
        <label>Destino</label>
        <app-destination-select
          v-model="filters.destination"
        ></app-destination-select>
      </div>
      <div class="form-group col-lg-6">
        <label>Pesquisar</label>
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
          <th>Destino</th>
          <th>Nome</th>
          <th>Ordem</th>
          <th>Tipo</th>
          <!-- <th class="app-table-actions">
            S.
            <i class="fa fa-info-circle" v-b-tooltip.hover title="Situação"></i>
          </th>-->
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
          <td>{{ entity.destination }}</td>
          <td>{{ entity.name }}</td>
          <td>{{ entity.order }}</td>
          <td>{{ entity.typeDesc }}</td>
          <!-- <td class="app-table-actions">
            <i
              v-b-tooltip.hover
              title="Verificado"
              class="fas fa-check-circle"
              :class="{
              'app-table-action-disabled': !entity.trusted,
              'text-success': entity.trusted,
            }"
            ></i>
          </td>-->
        </tr>
      </tbody>
    </table>
    <app-pagination :pagination="list" @paginate="list_refreshPage($event)" />
  </div>
</template>

<script>
import { listMixin } from '@mixins/list-mixin';
import axios from '@mixins/axios-auth';
import _ from 'lodash';
import FieldDestinationSelect from '@resources/gl_field/FieldDestinationSelect.vue';

export default {
  mixins: [listMixin],
  components: {
    'app-destination-select': FieldDestinationSelect,
  },
  data() {
    return {
      filters: {
        destination: 'gl_person',
      },
    };
  },
  computed: {
    list_title() {
      return 'Campos dinâmicos';
    },
    list_url_base() {
      return '/api/admin/gl_field';
    },
    list_route_base() {
      return 'gl_field';
    },
  },
  methods: {
    list_buildURL(page) {
      let url = `${this.list_url_base}?page=${page}&q=${encodeURIComponent(
        this.searchText
      )}`;
      if (this.filters.destination) {
        url += `&destination=${this.filters.destination}`;
      }
      return url;
    },
  },
};
</script>

<style scoped></style>
