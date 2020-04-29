<template>
  <div v-if="entity" class="container-fluid">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <br />
    <h1>{{ crud_title }}</h1>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-lg-12">
          <label>Nome genérico</label>
          <input
            class="form-control"
            name="name"
            type="text"
            v-model="entity.name"
            maxlength="60"
            placeholder="ex. Litro(s)"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-4">
          <label>Nome no singular</label>
          <input
            class="form-control"
            name="nameSingular"
            type="text"
            placeholder="ex. Litro"
            v-model="entity.nameSingular"
            maxlength="60"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Nome no plural</label>
          <input
            class="form-control"
            name="namePlural"
            type="text"
            placeholder="ex. Litros"
            v-model="entity.namePlural"
            maxlength="60"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Unidade</label>
          <input
            class="form-control"
            name="unit"
            type="text"
            placeholder="ex. L"
            v-model="entity.unit"
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
import { crudMixin } from '@mixins/crud-mixin'
import axios from '@mixins/axios-auth'

export default {
  mixins: [crudMixin],
  components: {},
  data() {
    return {
      entity: {
        name: null,
        nameSingular: null,
        namePlural: null,
        unit: null,
        // objects
      },
    }
  },
  methods: {
    crud_data() {
      return {
        name: this.entity.name,
        nameSingular: this.entity.nameSingular,
        namePlural: this.entity.namePlural,
        unit: this.entity.unit,
      }
    },
    crud_validate() {
      return true
    },
  },
  computed: {
    crud_title() {
      var ok = this.entity != null
      if (ok) {
        ok = this.entity.name != null
      }
      if (ok) {
        return '' + this.entity.name
      } else {
        return 'Cadastro de Unidade'
      }
    },
    crud_url_base() {
      return '/api/admin/gl_unit'
    },
    crud_route_base() {
      return 'gl_unit'
    },
  },
}
</script>

<style scoped></style>
