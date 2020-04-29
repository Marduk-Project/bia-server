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
        <div class="form-group col-lg-6">
          <label>field</label>
          <app-field-select v-model="entity.field"></app-field-select>
          <small class="text-danger" v-if="!entity.field"
            >Campo obrigatório.</small
          >
        </div>
        <div class="form-group col-lg-6">
          <label>fieldItem</label>
          <app-fieldItem-select
            v-model="entity.fieldItem"
          ></app-fieldItem-select>
        </div>
        <div class="form-group col-lg-6">
          <label>valueString</label>
          <input
            class="form-control"
            name="valueString"
            type="text"
            v-model="entity.valueString"
            maxlength="60"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>valueInt</label>
          <input
            class="form-control"
            name="valueInt"
            type="numeric"
            step="1"
            v-model="entity.valueInt"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>valueDouble</label>
          <input
            class="form-control"
            name="valueDouble"
            type="numeric"
            step="0.01"
            v-model="entity.valueDouble"
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

import FieldSelect from '@resources/gl_field/FieldSelect.vue'
import FieldItemSelect from '@resources/gl_field_item/FieldItemSelect.vue'

export default {
  mixins: [crudMixin],
  components: {
    'app-field-select': FieldSelect,
    'app-fieldItem-select': FieldItemSelect,
  },
  data() {
    return {
      entity: {
        fieldId: null,
        fieldItemId: null,
        personId: null,
        valueString: null,
        valueInt: null,
        valueDouble: null,
        valueBoolean: false,
        // objects
        field: null,
        fieldItem: null,
        person: null,
      },
    }
  },
  methods: {
    crud_data() {
      return {
        fieldId: this.entity.field ? this.entity.field.id : null,
        fieldItemId: this.entity.fieldItem ? this.entity.fieldItem.id : null,
        personId: this.parentEntityId,
        valueString: this.entity.valueString,
        valueInt: this.entity.valueInt,
        valueDouble: this.entity.valueDouble,
        valueBoolean: !!this.entity.valueBoolean,
      }
    },
    crud_validate() {
      if (!this.entity.field) {
        this.notify_warning('Selecione field.')
        return false
      }
      return true
    },
    crud_requestParentEntity() {
      return axios.get(`/api/admin/gl_person/${this.parentEntityId}/edit`)
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
        return 'Cadastro de gl_person_field'
      }
    },
    crud_url_base() {
      return '/api/admin/gl_person_field'
    },
    crud_route_base() {
      return 'gl_person_field'
    },
  },
}
</script>

<style scoped></style>
