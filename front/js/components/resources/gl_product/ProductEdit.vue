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
      <app-product-form :model="entity" />
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

  import ProductForm from './ProductForm.vue';
  import UnitSelect from '@resources/gl_unit/UnitSelect.vue';

  export default {
    mixins: [crudMixin],
    components: {
      'app-product-form': ProductForm,
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
