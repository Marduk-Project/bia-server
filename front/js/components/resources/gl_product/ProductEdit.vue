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
        <div class="form-group col-lg-12">
          <label>Descrição</label>
          <textarea
            name="description"
            class="form-control"
            rows="3"
            v-model="entity.description"
          ></textarea>
        </div>
        <div class="form-group col-lg-4">
          <label>Código EAN</label>
          <input
            class="form-control"
            name="eanCode"
            type="text"
            v-model="entity.eanCode"
            maxlength="60"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Código Anvisa</label>
          <input
            class="form-control"
            name="healthCode"
            type="text"
            v-model="entity.healthCode"
            maxlength="60"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Unidade de medida</label>
          <app-unit-select v-model="entity.unit"></app-unit-select>
          <small class="text-danger" v-if="!entity.unit"
            >Campo obrigatório.</small
          >
        </div>
      </div>
      <br />
      <h4>Regras</h4>
      <div class="form-row">
        <div class="form-group col-lg-12">
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                v-model="entity.requestFormActive"
              />
              Exibir produto no formulário de solicitações.
            </label>
          </div>
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

import UnitSelect from '@resources/gl_unit/UnitSelect.vue';

export default {
  mixins: [crudMixin],
  components: {
    'app-unit-select': UnitSelect,
  },
  data() {
    return {
      entity: {
        name: null,
        description: null,
        eanCode: null,
        healthCode: null,
        requestFormActive: false,
        unitId: null,
        // objects
        unit: null,
      },
    };
  },
  methods: {
    crud_data() {
      return {
        name: this.entity.name,
        description: this.entity.description,
        eanCode: this.entity.eanCode,
        healthCode: this.entity.healthCode,
        requestFormActive: !!this.entity.requestFormActive,
        unitId: this.entity.unit ? this.entity.unit.id : null,
      };
    },
    crud_validate() {
      if (!this.entity.unit) {
        this.notify_warning('Selecione a Unidade.');
        return false;
      }
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
        return 'Cadastro de Produto';
      }
    },
    crud_url_base() {
      return '/api/admin/gl_product';
    },
    crud_route_base() {
      return 'gl_product';
    },
  },
};
</script>

<style scoped></style>
