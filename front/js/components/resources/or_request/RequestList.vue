<template>
  <b-container>
    <br />
    <h1>{{ list_title }}</h1>
    <app-add-button @click="list_onAddClick"></app-add-button>
    <br />
    <br />
    <div class="form-row">
      <!-- Placeholder for research -->
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
  </b-container>
</template>

<script>
  import { listMixin } from '../../../libs/mixins/list-mixin';
  export default {
    mixins: [listMixin],
    data() {
      return {
        filters: {
          level: 0,
        },
      };
    },
    computed: {
      list_title() {
        return 'Demandas de EPIs';
      },
      list_url_base() {
        return '/api/admin/or_request';
      },
      list_route_base() {
        return 'or_request';
      },
    },
    methods: {
      list_buildURL(page) {
        let url =
          this.list_url_base +
          '?page=' +
          page +
          '&q=' +
          encodeURIComponent(this.searchText ? this.searchText : '');
        if (this.filters.level > 0) {
          url += `&level=${this.filters.level}`;
        }
        return url;
      },
    },
  };
</script>

<style scoped></style>
