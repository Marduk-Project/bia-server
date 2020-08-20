<template>
  <div class="container-fluid">
    <br />
    <h1>{{ list_title }}</h1>
    <app-add-button @click="list_onAddClick"></app-add-button>
    <br />
    <br />
    <div class="form-row">
      <div class="form-group col-lg-6">
        <label>Respondido pelo usuário</label>
        <app-user-select v-model="filters.userResponse"></app-user-select>
      </div>
      <div class="form-group col-lg-6">
        <label>Tipo</label>
        <app-form-contact-type-select
          :showAll="true"
          v-model="filters.type"
        ></app-form-contact-type-select>
      </div>
      <div class="form-group col-12">
        <div class="form-check">
          <label class="form-check-label">
            <input
              class="form-check-input"
              type="checkbox"
              value="1"
              v-model="filters.needsReview"
            />
            Exibir apenas contatos que precisam de resposta / revisão.
          </label>
        </div>
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
          <th>Recebido em</th>
          <th>Tipo</th>
          <th>Pessoa</th>
          <th>Assunto</th>
          <th>Resposta</th>
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
          <td
            ><app-datetime-span :value="entity.createdAt"></app-datetime-span
          ></td>
          <td>{{ entity.typeDesc }}</td>
          <td>{{ entity.personName }}</td>
          <td
            v-b-tooltip.hover
            :title="`${entity.subject}\n\n${entity.message}`"
            >{{ entity.subject | truncate(60) }}</td
          >
          <td v-b-tooltip.hover :title="entity.response">{{
            entity.response | truncate(60)
          }}</td>
          <td class="app-table-actions">
            <i
              v-b-tooltip.hover
              :title="entity.needsReview ? 'Aguardando resposta' : 'Respondido'"
              class="fas"
              :class="{
                'fa-certificate text-primary': entity.needsReview,
                'fa-check text-success': !entity.needsReview,
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
  import axios from '@mixins/axios-auth';
  import _ from 'lodash';

  import UserSelect from '../gl_user/UserSelect.vue';
  import FormContactTypeSelect from './FormContactTypeSelect.vue';

  export default {
    mixins: [listMixin],
    components: {
      'app-user-select': UserSelect,
      'app-form-contact-type-select': FormContactTypeSelect,
    },
    data() {
      return {
        filters: {
          userResponse: null,
          type: '0',
          needsReview: false,
        },
      };
    },
    computed: {
      list_title() {
        return 'Contatos via formulários';
      },
      list_url_base() {
        return '/api/admin/gl_form_contact';
      },
      list_route_base() {
        return 'gl_form_contact';
      },
    },
    methods: {
      list_buildURL(page) {
        let url = `${this.list_url_base}?page=${page}&q=${encodeURIComponent(
          this.searchText
        )}`;
        if (this.filters.userResponse) {
          url += `&userResponseId=${this.filters.userResponse.id}`;
        }
        if (this.filters.type != '0') {
          url += `&type=${this.filters.type}`;
        }
        if (this.filters.needsReview) {
          url += `&needsReview=1`;
        }
        return url;
      },
    },
  };
</script>

<style scoped></style>
