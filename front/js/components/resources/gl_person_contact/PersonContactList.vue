<template>
  <div class="container-fluid">
    <div v-if="useRoute">
      <br />
      <button
        v-if="origin == 'u'"
        type="button"
        class="btn btn-link"
        @click="
          $router.push({ name: 'gl_user.edit', params: { id: parentEntityId } })
        "
      >
        <i class="fa fa-chevron-left"></i> Voltar
      </button>
      <button
        v-if="origin == 'p'"
        type="button"
        class="btn btn-link"
        @click="
          $router.push({
            name: 'gl_person.edit',
            params: { id: parentEntityId },
          })
        "
      >
        <i class="fa fa-chevron-left"></i> Voltar
      </button>
    </div>
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
          <th>#</th>
          <th>Nome</th>
          <th v-if="origin != 'u'">Usuário</th>
          <th v-if="origin != 'p'">Pessoa</th>
          <th>Nivel</th>
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
          <td v-if="origin != 'u'">
            <app-user-item :entity="entity.user"></app-user-item>
          </td>
          <td v-if="origin != 'p'">
            <app-person-item :entity="entity.person"></app-person-item>
          </td>
          <td>{{ entity.levelDesc }}</td>
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
import { listMixin } from "@mixins/list-mixin";
import axios from "@mixins/axios-auth";
import _ from "lodash";
import PersonItem from "../gl_person/PersonItem.vue";
import PersonSelect from "../gl_person/PersonSelect.vue";
import UserItem from "../gl_user/UserItem.vue";
import UserSelect from "../gl_user/UserSelect.vue";

export default {
  mixins: [listMixin],
  components: {
    "app-person-item": PersonItem,
    "app-person-select": PersonSelect,
    "app-user-select": UserSelect,
    "app-user-item": UserItem,
  },
  data() {
    return {
      filters: {
        person: null,
        user: null,
      },
    };
  },
  computed: {
    list_title() {
      return "Contatos vinculados";
    },
    list_url_base() {
      return "/api/admin/gl_person_contact";
    },
    list_route_base() {
      return "gl_person_contact";
    },
    origin() {
      if (this.useRoute) {
        return this.$route.params.origin;
      }
      return "p";
    },
  },
  methods: {
    list_buildURL(page) {
      let url = `${this.list_url_base}?page=${page}&q=${encodeURIComponent(
        this.searchText
      )}`;
      switch (this.origin) {
        case "u":
          url += `&userId=${this.parentEntityId}`;
          break;

        default:
        case "p":
          url += `&personId=${this.parentEntityId}`;
          break;
      }
      return url;
    },
    list_requestParentEntity() {
      switch (this.origin) {
        case "u":
          return axios.get(`/api/admin/gl_user/${this.parentEntityId}/edit`);

        default:
        case "p":
          return axios.get(`/api/admin/gl_person/${this.parentEntityId}/edit`);
      }
    },
  },
};
</script>

<style scoped></style>
