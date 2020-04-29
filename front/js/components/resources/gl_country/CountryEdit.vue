<template>
  <div v-if="entity" class="container-fluid">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <h1>{{ crud_title }}</h1>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-lg-6">
          <label>Nome</label>
          <input
            name="name"
            placeholder="nome"
            class="form-control"
            type="text"
            v-model="entity.name"
            v-validate="'required'"
            maxlength="60"
            :class="{ 'is-invalid': errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Sigla</label>
          <input
            name="code"
            placeholder="código do país"
            class="form-control"
            type="text"
            v-model="entity.code"
            maxlength="10"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>Prioridade</label>
          <input
            name="priority"
            placeholder="prioridade na lista"
            class="form-control"
            type="number"
            v-model="entity.priority"
            maxlength="1"
          />
        </div>
      </div>
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

export default {
  mixins: [crudMixin],
  data() {
    return {
      entity: {
        id: null,
        name: null,
        code: null,
        priority: 0,
      },
    }
  },
  methods: {
    crud_data() {
      return {
        id: this.entity.id,
        name: this.entity.name,
        code: this.entity.code,
        priority: this.entity.priority,
      }
    },
  },
  computed: {
    crud_title() {
      var ok = this.entity != null
      if (ok) {
        ok = this.entity.name
      }
      if (ok) {
        return '' + this.entity.name
      } else {
        return 'Cadastro de País'
      }
    },
    crud_url_base() {
      return '/api/admin/gl_country'
    },
    crud_route_base() {
      return 'gl_country'
    },
  },
}
</script>

<style scoped></style>
