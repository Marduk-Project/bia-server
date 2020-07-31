<template>
  <div class="container-fluid">
    <br />
    <h1>{{ list_title }}</h1>
    <app-add-button @click="list_onAddClick"></app-add-button>
    <br />
    <br />
    <div class="form-row">
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
          <th class="app-table-id">#</th>
          <th>Nome</th>
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

  export default {
    mixins: [listMixin],
    components: {},
    data() {
      return {
        filters: {},
      };
    },
    computed: {
      list_title() {
        return 'Categorias de Solicitação & Entrega';
      },
      list_url_base() {
        return '/api/admin/or_order_category';
      },
      list_route_base() {
        return 'or_order_category';
      },
    },
    methods: {
      list_buildURL(page) {
        let url = `${this.list_url_base}?page=${page}&q=${encodeURIComponent(
          this.searchText
        )}`;
        return url;
      },
    },
  };
</script>

<style scoped></style>
