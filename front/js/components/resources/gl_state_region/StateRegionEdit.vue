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
          <label
            >Código
            <app-info title="Código no IBGE ou órgão competente."></app-info
          ></label>
          <input
            class="form-control"
            name="code"
            type="text"
            v-model="entity.code"
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
  import { crudMixin } from '@mixins/crud-mixin';
  import axios from '@mixins/axios-auth';

  export default {
    mixins: [crudMixin],
    components: {},
    data() {
      return {
        entity: {
          name: null,
          code: null,
          type: null,
          stateId: null,
          // objects
          state: null,
        },
      };
    },
    methods: {
      crud_data() {
        return {
          name: this.entity.name,
          code: this.entity.code,
          type: this.$route.params.type,
          stateId: this.parentEntityId,
        };
      },
      crud_validate() {
        return true;
      },
      crud_requestParentEntity() {
        return axios.get(`/api/admin/gl_state/${this.parentEntityId}/edit`);
      },
    },
    computed: {
      crud_subtitle() {
        switch (this.$route.params.type) {
          case 'meso':
            return 'Mesorregião';

          case 'micro':
            return 'Microrregião';

          case 'dre':
            return 'Região DRE';
        }
        return 'Desconhecido';
      },
      crud_title() {
        var ok = this.entity != null;
        if (ok) {
          ok = this.entity.name != null;
        }
        if (ok) {
          return '' + this.entity.name;
        } else {
          return `Cadastro de ${this.crud_subtitle}`;
        }
      },
      crud_url_base() {
        return '/api/admin/gl_state_region';
      },
      crud_route_base() {
        return 'gl_state_region';
      },
    },
  };
</script>

<style scoped></style>
