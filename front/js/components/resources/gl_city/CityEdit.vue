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
          <label>Código IBGE</label>
          <input
            name="ibgeCode"
            placeholder="ex. 12345"
            class="form-control"
            type="text"
            v-model="entity.ibgeCode"
            maxlength="60"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('ibgeCode') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Prioridade</label>
          <input
            name="priority"
            placeholder="prioridade"
            class="form-control"
            type="number"
            v-model="entity.priority"
            maxlength="1"
          />
        </div>
        <div class="form-group col-lg-6">
          <label>Estado</label>
          <app-state-select v-model="entity.state"></app-state-select>
          <small class="text-danger" v-if="!entity.state">Campo obrigatório.</small>
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
import { crudMixin } from "../../../libs/mixins/crud-mixin";
import StateSelect from "../gl_state/StateSelect.vue";

export default {
  mixins: [crudMixin],
  components: {
    "app-state-select": StateSelect
  },
  data() {
    return {
      entity: {
        id: null,
        name: null,
        priority: 0,
        ibgeCode: null,
        stateId: null,
        // objects
        state: null
      }
    };
  },
  methods: {
    crud_data() {
      return {
        id: this.entity.id,
        name: this.entity.name,
        priority: this.entity.priority,
        ibgeCode: this.entity.ibgeCode,
        stateId: this.entity.state ? this.entity.state.id : null
      };
    },
    crud_validate() {
      if (!this.entity.state) {
        this.notify_warning("Selecione um Estado.");
        return false;
      }
      return true;
    }
  },
  computed: {
    crud_title() {
      var ok = this.entity != null;
      if (ok) {
        ok = this.entity.name;
      }
      if (ok) {
        return "" + this.entity.name;
      } else {
        return "Cadastro de Cidade";
      }
    },
    crud_url_base() {
      return "/api/admin/gl_city";
    },
    crud_route_base() {
      return "gl_city";
    }
  }
};
</script>

<style scoped>
</style>
