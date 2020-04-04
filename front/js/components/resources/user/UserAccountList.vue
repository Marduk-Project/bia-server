<template>
  <div class="container">
    <br>
    <h1>{{ list_title }}</h1>
    <!-- <app-add-button @click="list_onAddClick"></app-add-button>
    <br>
    <br>-->
    <div class="form-row">
      <div class="form-group col-lg-12">
        <label>Pesquisar</label>
        <div class="input-group">
          <input
            type="text"
            v-model="searchText"
            class="form-control"
            aria-label
            @keyup.enter="list_refreshCurrentPage"
          >
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="list_refreshCurrentPage">
              <i class="fa fa-search"></i> Filtrar
            </button>
          </div>
        </div>
      </div>
      <div class="form-group col-lg-12">
        <div class="form-check">
          <label class="form-check-label">
            <input
              class="form-check-input"
              type="checkbox"
              value="1"
              v-model="filters.inactiveShow"
            >
            Mostrar inativos
          </label>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped">
      <thead>
        <tr class>
          <th class="app-table-id">
            <app-info title="ID"></app-info>
          </th>
          <th>Nome</th>
          <th>E-mail</th>
          <th class="app-table-actions">
            S.
            <app-info title="Situação"/>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          style="cursor: pointer;"
          v-for="entity in list.data"
          :key="entity._id"
          @click="list_onItemClick(entity)"
        >
          <td>
            <app-id :title="entity._id"></app-id>
          </td>
          <td>{{ entity.name }}</td>
          <td>{{ entity.email }}</td>
          <td class="app-table-actions">
            <i
              class="fas"
              :class="{ 'text-success fa-check': !entity.inactive, 'text-danger fa-ban': entity.inactive }"
            ></i>
          </td>
        </tr>
      </tbody>
    </table>
    <app-pagination :pagination="list" @paginate="list_refreshPage($event)"/>
  </div>
</template>

<script>
import { listMixin } from "../../../libs/mixins/list-mixin";

export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      filters: {
        level: 0,
        inactiveShow: false
      }
    };
  },
  computed: {
    list_title() {
      return "Usuários";
    },
    list_url_base() {
      return "/api/account/user";
    },
    list_route_base() {
      return "user";
    }
  },
  methods: {
    list_buildURL(page) {
      let url =
        this.list_url_base +
        "?page=" +
        page +
        "&q=" +
        encodeURIComponent(this.searchText ? this.searchText : "");
      if (this.filters.level > 0) {
        url += `&level=${this.filters.level}`;
      }
      if (this.filters.inactiveShow) {
        url += `&inactiveShow=1`;
      }
      return url;
    }
  }
};
</script>

<style scoped>
</style>
