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
        <div class="form-group col-lg-9">
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
            name="code"
            placeholder="ex. 12345"
            class="form-control"
            type="text"
            v-model="entity.code"
            maxlength="60"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('code') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Sigla</label>
          <input
            name="initials"
            placeholder="ex. POA"
            class="form-control"
            type="text"
            v-model="entity.initials"
            maxlength="60"
          />
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
          <small class="text-danger" v-if="!entity.state"
            >Campo obrigatório.</small
          >
        </div>
        <div class="form-group col-lg-4">
          <label>Microrregião</label>
          <app-state-region-select
            :disabled="!entity.state"
            :extraparams="{
              stateId: entity.state ? entity.state.id : null,
              type: 'micro',
            }"
            v-model="entity.microRegion"
          ></app-state-region-select>
        </div>
        <div class="form-group col-lg-4">
          <label>Mesorregião</label>
          <app-state-region-select
            :disabled="!entity.state"
            :extraparams="{
              stateId: entity.state ? entity.state.id : null,
              type: 'meso',
            }"
            v-model="entity.mesoRegion"
          ></app-state-region-select>
        </div>
        <div class="form-group col-lg-4">
          <label>Macrorregião</label>
          <app-state-region-select
            :disabled="!entity.state"
            :extraparams="{
              stateId: entity.state ? entity.state.id : null,
              type: 'macro',
            }"
            v-model="entity.macroRegion"
          ></app-state-region-select>
        </div>
        <div class="form-group col-lg-4">
          <label>Coordenação de Saúde</label>
          <app-state-region-select
            :disabled="!entity.state"
            :extraparams="{
              stateId: entity.state ? entity.state.id : null,
              type: 'healthCoordenation',
            }"
            v-model="entity.healthCoordenationRegion"
          ></app-state-region-select>
        </div>
        <div class="form-group col-lg-4">
          <label>Região de Saúde</label>
          <app-state-region-select
            :disabled="!entity.state"
            :extraparams="{
              stateId: entity.state ? entity.state.id : null,
              type: 'healthMicro',
            }"
            v-model="entity.healthMicroRegion"
          ></app-state-region-select>
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
  import { crudMixin } from '@mixins/crud-mixin';
  import StateSelect from '@resources/gl_state/StateSelect.vue';
  import StateRegionSelect from '@resources/gl_state_region/StateRegionSelect.vue';

export default {
  mixins: [crudMixin],
  components: {
    "app-state-select": StateSelect,
    "app-state-region-select": StateRegionSelect,
  },
  data() {
    return {
      entity: {
        id: null,
        name: null,
        priority: 0,
        code: null,
        initials: null,
        stateId: null,
        // objects
        state: null,
        mesoRegion: null,
        microRegion: null,
        macroRegion: null,
        healthCoordenationRegion: null,
        healthMicroRegion: null,
      },
    };
  },
  methods: {
    crud_data() {
      return {
        id: this.entity.id,
        name: this.entity.name,
        priority: this.entity.priority,
        code: this.entity.code,
        initials: this.entity.initials,
        stateId: this.entity.state ? this.entity.state.id : null,
        mesoRegionId: this.entity.mesoRegion ? this.entity.mesoRegion.id : null,
        microRegionId: this.entity.microRegion
          ? this.entity.microRegion.id
          : null,
        macroRegionId: this.entity.macroRegion
          ? this.entity.macroRegion.id
          : null,
        healthCoordenationRegionId: this.entity.healthCoordenationRegion
          ? this.entity.healthCoordenationRegion.id
          : null,
        healthMicroRegionId: this.entity.healthMicroRegion
          ? this.entity.healthMicroRegion.id
          : null,
      };
    },
    crud_validate() {
      if (!this.entity.state) {
        this.notify_warning("Selecione um Estado.");
        return false;
      }
      return true;
    },
  },
  watch: {
    entity_state(newValue, oldValue) {
      if (!newValue) {
        this.entity.mesoRegion = null;
        this.entity.microRegion = null;
        this.entity.macroRegion = null;
        this.entity.healthCoordenationRegion = null;
        this.entity.healthMicroRegion = null;
      } else if (oldValue && newValue.id != (oldValue ? oldValue.id : null)) {
        this.entity.mesoRegion = null;
        this.entity.microRegion = null;
        this.entity.macroRegion = null;
        this.entity.healthCoordenationRegion = null;
        this.entity.healthMicroRegion = null;
      }
    },
  },
  computed: {
    entity_state() {
      return this.entity.state;
    },
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
    watch: {
      entity_state(newValue, oldValue) {
        if (!newValue) {
          this.entity.mesoRegion = null;
          this.entity.microRegion = null;
          this.entity.dreRegion = null;
        }
      },
    },
    computed: {
      entity_state() {
        return this.entity.state;
      },
      crud_title() {
        var ok = this.entity != null;
        if (ok) {
          ok = this.entity.name;
        }
        if (ok) {
          return '' + this.entity.name;
        } else {
          return 'Cadastro de Cidade';
        }
      },
      crud_url_base() {
        return '/api/admin/gl_city';
      },
      crud_route_base() {
        return 'gl_city';
      },
    },
  };
</script>

<style scoped></style>
