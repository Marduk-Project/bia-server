<template>
  <div v-if="entity" class="container-fluid">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <h1>{{ crud_title }}</h1>
    <div v-if="entity.id != null && entity.type == 5">
      <router-link
        class="btn btn-outline-secondary"
        tag="button"
        :to="{ name: 'gl_field_item.index', params: { parentEntityId: entity.id, parentEntity: entity } }"
      >
        <i class="fas fa-list"></i> Itens
      </router-link>
      <br />
      <br />
    </div>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-lg-6">
          <label>Nome</label>
          <input
            class="form-control"
            name="name"
            type="text"
            v-model="entity.name"
            maxlength="60"
            v-validate="'required'"
            :class="{ 'is-invalid':errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Destino</label>
          <app-destination-select
            v-model="entity.destination"
            name="destination"
            v-validate="'required'"
            :classes="{ 'is-invalid':errors.has('destination') }"
          ></app-destination-select>
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Código</label>
          <input class="form-control" name="code" type="text" v-model="entity.code" maxlength="60" />
        </div>
        <div class="form-group col-lg-3">
          <label>Tipo</label>
          <app-type-select
            v-model="entity.type"
            name="type"
            v-validate="'required'"
            :classes="{ 'is-invalid':errors.has('type') }"
          ></app-type-select>
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Ordem</label>
          <input class="form-control" name="order" type="numeric" step="1" v-model="entity.order" />
        </div>
        <div class="form-group col-lg-6">
          <label>Valor padrão</label>
          <input
            class="form-control"
            name="defaultValue"
            type="text"
            v-model="entity.defaultValue"
            maxlength="60"
          />
        </div>
      </div>
      <br />
      <div class="form-row">
        <app-crud-buttons
          @onSave="crud_onSaveAction"
          @onDelete="crud_onDeleteAction"
          :delete-show="entity.id != null"
        ></app-crud-buttons>
      </div>
      <app-entitybaseinfo :entity="entity"></app-entitybaseinfo>
    </form>
  </div>
</template>

<script>
import { crudMixin } from "../../../libs/mixins/crud-mixin";
import axios from "../../../libs/mixins/axios-auth";

import FieldDestinationSelect from "./FieldDestinationSelect.vue";
import FieldTypeSelect from "./FieldTypeSelect.vue";

export default {
  mixins: [crudMixin],
  components: {
    "app-destination-select": FieldDestinationSelect,
    "app-type-select": FieldTypeSelect
  },
  data() {
    return {
      entity: {
        name: null,
        destination: "gl_person",
        code: null,
        type: 1,
        order: 0,
        defaultValue: null
        // objects
      }
    };
  },
  methods: {
    crud_data() {
      return {
        name: this.entity.name,
        destination: this.entity.destination,
        code: this.entity.code,
        type: this.entity.type,
        order: this.entity.order,
        defaultValue: this.entity.defaultValue
      };
    },
    crud_validate() {
      return true;
    },
    crud_shouldNavBackAfterSave() {
      return false;
    }
  },
  computed: {
    crud_title() {
      var ok = this.entity != null;
      if (ok) {
        ok = this.entity.name != null;
      }
      if (ok) {
        return "" + this.entity.name;
      } else {
        return "Cadastro de Campo";
      }
    },
    crud_url_base() {
      return "/api/admin/gl_field";
    },
    crud_route_base() {
      return "gl_field";
    }
  }
};
</script>

<style scoped>
</style>
