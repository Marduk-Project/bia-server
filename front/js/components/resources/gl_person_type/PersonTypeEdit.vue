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
        <div class="form-group col-lg-9">
          <label>Nome</label>
          <input
            class="form-control"
            name="name"
            type="text"
            v-model="entity.name"
            maxlength="60"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Prioridade</label>
          <input
            class="form-control"
            name="priority"
            type="number"
            step="1"
            v-model="entity.priority"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('priority') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
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
  import { crudMixin } from '@mixins/crud-mixin';
  import axios from '@mixins/axios-auth';

  export default {
    mixins: [crudMixin],
    components: {},
    data() {
      return {
        entity: {
          name: null,
          priority: 0,
          // objects
        },
      };
    },
    methods: {
      crud_data() {
        return {
          name: this.entity.name,
          priority: this.entity.priority,
        };
      },
      crud_validate() {
        return true;
      },
    },
    computed: {
      crud_title() {
        var ok = this.entity != null;
        if (ok) {
          ok = this.entity.name != null;
        }
        if (ok) {
          return '' + this.entity.name;
        } else {
          return 'Cadastro de Tipo de Pessoa';
        }
      },
      crud_url_base() {
        return '/api/admin/gl_person_type';
      },
      crud_route_base() {
        return 'gl_person_type';
      },
    },
  };
</script>

<style scoped></style>
