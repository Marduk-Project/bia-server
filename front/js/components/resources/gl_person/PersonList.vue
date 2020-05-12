<template>
  <div class="container-fluid">
    <br />
    <h1>{{ list_title }}</h1>
    <app-add-button @click="list_onAddClick"></app-add-button>
    <br />
    <br />
    <div class="form-row">
      <div class="form-group col-lg-3">
        <label>Cidade</label>
        <app-city-select v-model="filters.city"></app-city-select>
      </div>
      <div class="form-group col-lg-3">
        <label>Tipo legal</label>
        <app-legal-type-select
          v-model="filters.legalType"
          :show-all="true"
        ></app-legal-type-select>
      </div>
      <div class="form-group col-lg-3">
        <label>Tipo entidade</label>
        <app-person-type-select
          v-model="filters.personType"
        ></app-person-type-select>
      </div>
      <div class="form-group col-lg-3">
        <label>Prioridade</label>
        <input
          v-model="filters.priority"
          type="number"
          step="1"
          class="form-control"
        />
      </div>
      <div class="form-group col-lg-12">
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
          <th>Cidade</th>
          <th>Tipo entidade</th>
          <th>Prioridade (Grau COVID)</th>
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
          <td>{{ entity.name }}</td>
          <td>{{ entity.city ? entity.city.name : null }}</td>
          <td>{{ entity.personType ? entity.personType.name : null }}</td>
          <td>{{ entity.priority }}</td>
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
  import { listMixin } from '@mixins/list-mixin';
  import CitySelect from '@resources/gl_city/CitySelect.vue';
  import PersonLegalTypeSelect from './PersonLegalTypeSelect.vue';
  import PersonTypeSelect from '../gl_person_type/PersonTypeSelect.vue';

  export default {
    mixins: [listMixin],
    components: {
      'app-city-select': CitySelect,
      'app-legal-type-select': PersonLegalTypeSelect,
      'app-person-type-select': PersonTypeSelect,
    },
    data() {
      return {
        filters: {
          city: null,
          legalType: 0,
          personType: null,
          priority: '',
        },
      };
    },
    computed: {
      list_title() {
        return 'Pessoas físicas e jurídicas';
      },
      list_url_base() {
        return '/api/admin/gl_person';
      },
      list_route_base() {
        return 'gl_person';
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
        if (this.filters.city) {
          url += `&cityId=${this.filters.city.id}`;
        }
        if (this.filters.legalType > 0) {
          url += `&legalType=${this.filters.legalType}`;
        }
        if (this.filters.personType) {
          url += `&personTypeId=${this.filters.personType.id}`;
        }
        if (this.filters.priority !== '') {
          url += `&priority=${this.filters.priority}`;
        }
        return url;
      },
    },
  };
</script>

<style scoped></style>
