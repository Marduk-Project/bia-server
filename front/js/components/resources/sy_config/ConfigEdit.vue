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
        <div class="form-group col-lg-3">
          <label>Código</label>
          <input
            class="form-control"
            name="code"
            type="text"
            v-model="entity.code"
            maxlength="60"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('code') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-9">
          <label>Nome/Descrição da configuração</label>
          <input
            class="form-control"
            name="name"
            type="text"
            v-model="entity.name"
            maxlength="90"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-4">
          <label>Valor String 1</label>
          <input
            class="form-control"
            name="valueString1"
            type="text"
            v-model="entity.valueString1"
            maxlength="500"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Valor String 2</label>
          <input
            class="form-control"
            name="valueString2"
            type="text"
            v-model="entity.valueString2"
            maxlength="500"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Valor String 3</label>
          <input
            class="form-control"
            name="valueString3"
            type="text"
            v-model="entity.valueString3"
            maxlength="500"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Valor Int 1</label>
          <input
            class="form-control"
            name="valueInt1"
            type="number"
            step="1"
            v-model="entity.valueInt1"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Valor Int 2</label>
          <input
            class="form-control"
            name="valueInt2"
            type="number"
            step="1"
            v-model="entity.valueInt2"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Valor Int 3</label>
          <input
            class="form-control"
            name="valueInt3"
            type="number"
            step="1"
            v-model="entity.valueInt3"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Valor Double 1</label>
          <input
            class="form-control"
            name="valueDouble1"
            type="number"
            step="0.01"
            v-model="entity.valueDouble1"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Valor Double 2</label>
          <input
            class="form-control"
            name="valueDouble2"
            type="number"
            step="0.01"
            v-model="entity.valueDouble2"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Valor Double 3</label>
          <input
            class="form-control"
            name="valueDouble3"
            type="number"
            step="0.01"
            v-model="entity.valueDouble3"
          />
        </div>
        <div class="form-group col-lg-4">
          <label>Valor Data-hora 1</label>
          <app-input-datetime v-model="entity.valueDate1"></app-input-datetime>
        </div>
        <div class="form-group col-lg-4">
          <label>Valor Data-hora 2</label>
          <app-input-datetime v-model="entity.valueDate2"></app-input-datetime>
        </div>
        <div class="form-group col-lg-4">
          <label>Valor Data-hora 3</label>
          <app-input-datetime v-model="entity.valueDate3"></app-input-datetime>
        </div>
        <div class="form-group col-12">
          <label>Valor texto 1</label>
          <textarea
            class="form-control"
            name="valueText1"
            v-model="entity.valueText1"
            rows="3"
          />
        </div>
        <div class="form-group col-12">
          <label>Valor texto 2</label>
          <textarea
            class="form-control"
            name="valueText2"
            v-model="entity.valueText2"
            rows="3"
          />
        </div>
        <div class="form-group col-12">
          <label>Valor texto 3</label>
          <textarea
            class="form-control"
            name="valueText3"
            v-model="entity.valueText3"
            rows="3"
          />
        </div>
        <div class="form-group col-12">
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                v-model="entity.valueBoolean1"
              />
              Valor lógico 1.
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                v-model="entity.valueBoolean2"
              />
              Valor lógico 2.
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                v-model="entity.valueBoolean3"
              />
              Valor lógico 3.
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

  export default {
    mixins: [crudMixin],
    components: {},
    data() {
      return {
        entity: {
          code: null,
          valueString1: null,
          valueString2: null,
          valueString3: null,
          valueText1: null,
          valueText2: null,
          valueText3: null,
          valueInt1: 0,
          valueInt2: 0,
          valueInt3: 0,
          valueDouble1: 0,
          valueDouble2: 0,
          valueDouble3: 0,
          valueBoolean1: false,
          valueBoolean2: false,
          valueBoolean3: false,
          valueDate1: null,
          valueDate2: null,
          valueDate3: null,
          // objects
        },
      };
    },
    methods: {
      crud_data() {
        return {
          code: this.entity.code,
          name: this.entity.name,
          valueString1: this.entity.valueString1,
          valueString2: this.entity.valueString2,
          valueString3: this.entity.valueString3,
          valueText1: this.entity.valueText1,
          valueText2: this.entity.valueText2,
          valueText3: this.entity.valueText3,
          valueInt1: this.entity.valueInt1,
          valueInt2: this.entity.valueInt2,
          valueInt3: this.entity.valueInt3,
          valueDouble1: this.entity.valueDouble1,
          valueDouble2: this.entity.valueDouble2,
          valueDouble3: this.entity.valueDouble3,
          valueBoolean1: !!this.entity.valueBoolean1,
          valueBoolean2: !!this.entity.valueBoolean2,
          valueBoolean3: !!this.entity.valueBoolean3,
          valueDate1: this.entity.valueDate1,
          valueDate2: this.entity.valueDate2,
          valueDate3: this.entity.valueDate3,
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
          return 'Cadastro de Configuração';
        }
      },
      crud_url_base() {
        return '/api/admin/sy_config';
      },
      crud_route_base() {
        return 'sy_config';
      },
    },
  };
</script>

<style scoped></style>
