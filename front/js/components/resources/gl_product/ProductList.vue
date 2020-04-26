<template>
  <div class="container-fluid">
    <br />
    <h1>{{ list_title }}</h1>
    <app-add-button @click="list_onAddClick"></app-add-button>
    <br />
    <br />
    <div class="form-row">
      <div class="form-group col-lg-12">
        <div class="form-check">
          <label class="form-check-label">
            <input
              class="form-check-input"
              type="checkbox"
              value="1"
              v-model="filters.requestFormActive"
            />
            Exibir apenas produtos do formulário de solicitações.
          </label>
        </div>
      </div>
    </div>
    <div class="form-row">
      <!-- 
      <div class="form-group col-lg-6">
        <label>unity</label>
        <app-unity-select v-model="filters.unity"></app-unity-select>
      </div>
      -->
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
          <th>Unidade</th>
          <th>Cód. EAN</th>
          <th>Cód. Anvisa</th>
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
          <td>
            <app-unity-item :entity="entity.unity"></app-unity-item>
          </td>
          <td>{{ entity.eanCode }}</td>
          <td>{{ entity.healthCode }}</td>
          <td class="app-table-actions">
            <i
              v-b-tooltip.hover
              title="Exibe no formulário de solicitações."
              class="fas fa-clipboard-list"
              :class="{
                'app-table-action-disabled': !entity.requestFormActive,
                'text-success': entity.requestFormActive,
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
import { listMixin } from "../../../libs/mixins/list-mixin";
import axios from "../../../libs/mixins/axios-auth";
import _ from "lodash";
import UnityItem from "../gl_unity/UnityItem.vue";

// import UnitySelect from "../gl_unity/UnitySelect.vue";

export default {
  mixins: [listMixin],
  components: {
    "app-unity-item": UnityItem,
    // "app-unity-select": UnitySelect,
  },
  data() {
    return {
      filters: {
        unity: null,
        requestFormActive: false,
      },
    };
  },
  computed: {
    list_title() {
      return "Produtos";
    },
    list_url_base() {
      return "/api/admin/gl_product";
    },
    list_route_base() {
      return "gl_product";
    },
  },
  methods: {
    list_buildURL(page) {
      let url = `${this.list_url_base}?page=${page}&q=${encodeURIComponent(
        this.searchText
      )}`;
      if (this.filters.unity) {
        url += `&unityId=${this.filters.unity.id}`;
      }
      if (this.filters.requestFormActive) {
        url += `&requestFormActive=1`;
      }
      return url;
    },
  },
};
</script>

<style scoped></style>
