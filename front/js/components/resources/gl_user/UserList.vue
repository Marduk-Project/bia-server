<template>
  <div class="container-fluid">
    <br />
    <h1>{{ list_title }}</h1>
    <app-add-button @click="list_onAddClick"></app-add-button>
    <br />
    <br />
    <div class="form-row">
      <div class="form-group col-lg-4">
        <label>Nível</label>
        <app-user-level-select
          v-model="filters.level"
          :show-all="true"
        ></app-user-level-select>
      </div>
      <div class="form-group col-lg-8">
        <label>Pesquisar</label>
        <div class="input-group mb-3">
          <input
            type="text"
            v-model="searchText"
            class="form-control"
            aria-label
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
          <th class="app-table-id">
            <app-info title="ID"></app-info>
          </th>
          <th>Apelido</th>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Nível</th>
          <th class="text-right">
            S.
            <app-info title="Situação"></app-info>
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
          <td>{{ entity.nickname }}</td>
          <td>{{ entity.name }}</td>
          <td>{{ entity.email }}</td>
          <td>{{ entity.levelDesc }}</td>
          <td class="text-right">
            <i
              class="fa fa-ban text-danger"
              v-if="entity.blocked"
              v-b-tooltip.hover
              title="Bloqueado"
            ></i>
            <i
              class="fa fa-check text-success"
              v-else
              v-b-tooltip.hover
              title="Ativo"
            ></i>
          </td>
        </tr>
      </tbody>
    </table>
    <app-pagination :pagination="list" @paginate="list_refreshPage($event)" />
  </div>
</template>

<script>
import { listMixin } from "../../../libs/mixins/list-mixin";
import UserLevelSelect from "./UserLevelSelect.vue";

export default {
  mixins: [listMixin],
  components: {
    "app-user-level-select": UserLevelSelect,
  },
  data() {
    return {
      filters: {
        level: 0,
      },
    };
  },
  computed: {
    list_title() {
      return "Usuários";
    },
    list_url_base() {
      return "/api/admin/gl_user";
    },
    list_route_base() {
      return "gl_user";
    },
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
      return url;
    },
  },
};
</script>

<style scoped></style>
