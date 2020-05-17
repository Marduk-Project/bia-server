<template>
  <div class="container-fluid">
    <br />
    <h1>{{ list_title }}</h1>
    <div>
      <a
        class="btn btn-outline-secondary"
        href="/api/account/or_order_consolidated/export"
        target="_blank"
      >
        <i class="fas fa-file-excel"></i> Exportar
        <app-info
          title="Exportar para colunas e linhas, permitindo colar no Microsoft Excel."
        ></app-info>
      </a>
    </div>
    <br />
    <div class="form-row">
      <div class="form-group col-lg-6">
        <label>Entidade destino</label>
        <app-person-select
          v-model="filters.glPersonDestination"
        ></app-person-select>
      </div>
      <div class="form-group col-lg-6">
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
          <th>Entidade de destino</th>
          <th>Produto</th>
          <th class="text-center">Consumível</th>
          <th class="text-right">Solicitado</th>
          <th class="text-right">Entrega futura</th>
          <th class="text-right">Em transporte</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entity in list.data" :key="entity.id">
          <td>{{ entity.id }}</td>
          <td>
            <app-person-item
              :entity="entity.glPersonDestination"
            ></app-person-item>
          </td>
          <td>{{ entity.glProduct.name }}</td>
          <td class="text-center"
            ><i
              class="fas fa-recycle"
              v-b-tooltip.hover
              :title="entity.glProduct.consumable ? 'Sim' : 'Não'"
              :class="{
                'text-success': entity.glProduct.consumable,
                'app-table-action-disabled': !entity.glProduct.consumable,
              }"
            ></i
          ></td>
          <td class="text-right">{{ entity.requestQuantity }}</td>
          <td class="text-right">{{ entity.supplyReserveQuantity }}</td>
          <td class="text-right">{{ entity.supplyTransportQuantity }}</td>
        </tr>
      </tbody>
    </table>
    <app-pagination :pagination="list" @paginate="list_refreshPage($event)" />
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import { listMixin } from '../../../libs/mixins/list-mixin';

  import PersonSelect from '@resources/gl_person/PersonSelect.vue';
  import PersonItem from '@resources/gl_person/PersonItem.vue';

  export default {
    mixins: [listMixin],
    components: {
      'app-person-select': PersonSelect,
      'app-person-item': PersonItem,
    },
    data() {
      return {
        filters: {
          glPersonDestination: null,
        },
      };
    },
    computed: {
      ...mapGetters({
        isUserStaff: 'isUserStaff',
        isContextAdmin: 'isContextAdmin',
      }),
      list_title() {
        return 'Consolidado de Solicitações & Entregas';
      },
      list_url_base() {
        return '/api/account/or_order_consolidated';
      },
      list_route_base() {
        return 'or_order_consolidated';
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
        if (this.filters.glPersonDestination) {
          url += `&glPersonDestinationId=${this.filters.glPersonDestination.id}`;
        }
        return url;
      },
    },
  };
</script>

<style scoped></style>
