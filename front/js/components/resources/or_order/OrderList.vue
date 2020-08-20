<template>
  <div class="container-fluid">
    <br />
    <h1>{{ list_title }}</h1>
    <div>
      <app-add-button @click="list_onAddClick"></app-add-button>
      <span>&nbsp;</span>
      <router-link
        type="button"
        tag="button"
        class="btn btn-outline-secondary"
        :to="{
          name: 'or_order_consolidated.index',
          params: {
            changed: false,
            page: {
              filters: {
                glPersonDestination: filters.glPersonDestination,
              },
              page: {
                data: [],
              },
            },
          },
        }"
      >
        <i class="fas fa-table"></i> Ver consolidado
      </router-link>

      <button
        type="button"
        class="btn btn-outline-secondary ml-1"
        @click="onExportClick"
      >
        <i class="fas fa-file-excel"></i> Exportar
        <app-info
          title="Exportar para colunas e linhas, permitindo colar no Microsoft Excel."
        ></app-info>
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary ml-1"
        @click="onExportSupplyClick"
      >
        <i class="fas fa-file-excel"></i> Exportar entregas
        <app-info title="Exportar um segundo formato de integração."></app-info>
      </button>
    </div>
    <br />
    <br />
    <div class="form-row">
      <div class="form-group col-lg-6" v-if="isContextAdmin">
        <label>Entidade destino</label>
        <app-person-select
          v-model="filters.glPersonDestination"
        ></app-person-select>
      </div>
      <div class="form-group col-lg-6" v-if="isContextAdmin">
        <label>Entidade origem</label>
        <app-person-select v-model="filters.glPersonOrigin"></app-person-select>
      </div>
      <div class="form-group col-lg-4">
        <label>Situação</label>
        <app-order-status-select
          v-model="filters.status"
          :show-all="true"
        ></app-order-status-select>
      </div>
      <div class="form-group col-lg-4">
        <label>Tipo</label>
        <app-order-type-select
          v-model="filters.type"
          :show-all="true"
        ></app-order-type-select>
      </div>
      <div class="form-group col-lg-4">
        <label>Categoria</label>
        <app-order-category-select
          v-model="filters.orderCategory"
        ></app-order-category-select>
      </div>
      <div class="form-group col-lg-12" v-if="isContextAdmin">
        <div class="form-check">
          <label class="form-check-label">
            <input
              class="form-check-input"
              type="checkbox"
              value="1"
              v-model="filters.needsReview"
            />
            Exibir ordens que precisam de revisão.
          </label>
        </div>
      </div>
      <div class="form-group col-lg-12">
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
          <th>Tipo</th>
          <th>Data</th>
          <th>Entidade de destino</th>
          <th
            >Contato <app-info title="Contato na Entidade de Destino"></app-info
          ></th>
          <th
            >Origem
            <app-info
              title="Responsável pela solicitação, entrega ou gestora da demanda."
            ></app-info
          ></th>
          <th>Categoria</th>
          <th>Status</th>
          <!-- <th class="text-right">
            S.
            <app-info title="Situação"></app-info>
          </th> -->
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
          <td>{{ entity.typeDesc }}</td>
          <td>
            <app-date-real-span
              :value="entity.effectiveDate"
            ></app-date-real-span>
          </td>
          <td style="max-width: 25%;">
            <app-person-item
              :entity="entity.glPersonDestination"
            ></app-person-item> </td
          ><td>
            <app-person-contact-item
              :entity="entity.glPersonContactDestination"
            ></app-person-contact-item>
          </td>
          <td style="max-width: 25%;">
            <app-person-item :entity="entity.glPersonOrigin"></app-person-item>
          </td>
          <td>{{ entity.orderCategory ? entity.orderCategory.name : '' }}</td>
          <td>{{ entity.statusDesc }}</td>
          <!--
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
          -->
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
  import PersonContactItem from '@resources/gl_person_contact/PersonContactItem.vue';
  import UserItem from '@resources/gl_user/UserItem.vue';
  import OrderTypeSelect from './OrderTypeSelect.vue';
  import OrderStatusSelect from './OrderStatusSelect.vue';
  import OrderCategorySelect from '../or_order_category/OrderCategorySelect.vue';

  export default {
    mixins: [listMixin],
    components: {
      'app-person-select': PersonSelect,
      'app-person-item': PersonItem,
      'app-person-contact-item': PersonContactItem,
      'app-user-item': UserItem,
      'app-order-type-select': OrderTypeSelect,
      'app-order-status-select': OrderStatusSelect,
      'app-order-category-select': OrderCategorySelect,
    },
    data() {
      return {
        filters: {
          type: 0,
          status: 0,
          glPersonOrigin: null,
          glPersonDestination: null,
          orderCategory: null,
          needsReview: false,
        },
      };
    },
    computed: {
      ...mapGetters({
        isUserStaff: 'isUserStaff',
        isContextAdmin: 'isContextAdmin',
      }),
      list_title() {
        return 'Solicitações & Entregas';
      },
      list_url_base() {
        return '/api/account/or_order';
      },
      list_route_base() {
        return 'or_order';
      },
    },
    methods: {
      buildURL() {
        let url =
          '?q=' + encodeURIComponent(this.searchText ? this.searchText : '');
        if (this.filters.status > 0) {
          url += `&status=${this.filters.status}`;
        }
        if (this.filters.type > 0) {
          url += `&type=${this.filters.type}`;
        }
        if (this.filters.glPersonOrigin) {
          url += `&glPersonOriginId=${this.filters.glPersonOrigin.id}`;
        }
        if (this.filters.glPersonDestination) {
          url += `&glPersonDestinationId=${this.filters.glPersonDestination.id}`;
        }
        if (this.filters.orderCategory) {
          url += `&orderCategoryId=${this.filters.orderCategory.id}`;
        }
        if (this.filters.needsReview) {
          url += `&needsReview=1`;
        }
        return url;
      },
      list_buildURL(page) {
        return `${this.list_url_base}/${this.buildURL()}&page=${page}`;
      },
      onExportClick() {
        let url = `${this.list_url_base}/export${this.buildURL()}`;
        window.open(url, '_order');
      },
      onExportSupplyClick() {
        let url = `${this.list_url_base}/exportSupply${this.buildURL()}`;
        window.open(url, '_orderSupply');
      },
    },
  };
</script>

<style scoped></style>
