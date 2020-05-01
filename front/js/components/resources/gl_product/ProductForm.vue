<template>
  <div>
    <div class="form-row">
      <div class="form-group col-lg-12">
        <label>Nome</label>
        <input
          class="form-control"
          name="name"
          type="text"
          v-model="model.name"
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
          v-model="model.description"
        ></textarea>
      </div>
      <div class="form-group col-lg-4">
        <label>Código EAN</label>
        <input
          class="form-control"
          name="eanCode"
          type="text"
          v-model="model.eanCode"
          maxlength="60"
        />
      </div>
      <div class="form-group col-lg-4">
        <label>Código Anvisa</label>
        <input
          class="form-control"
          name="healthCode"
          type="text"
          v-model="model.healthCode"
          maxlength="60"
        />
      </div>
      <div class="form-group col-lg-4">
        <label>Unidade de medida</label>
        <app-unit-select v-model="model.unit" @input="defineUnitId" />
        <small class="text-danger" v-if="!model.unit">
          Campo obrigatório.
        </small>
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
              v-model="model.requestFormActive"
            />
            Exibir produto no formulário de solicitações.
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UnitSelect from '@resources/gl_unit/UnitSelect.vue';
  export default {
    props: {
      model: {
        type: Object,
        required: true,
      },
    },
    components: {
      'app-unit-select': UnitSelect,
    },
    beforeMount() {
      if (Object.keys(this.model).length === 0) {
        Object.assign(this.model, {
          name: null,
          description: null,
          eanCode: null,
          healthCode: null,
          requestFormActive: false,
          unitId: null,
          // objects
          unit: null,
        });
      }
    },
    methods: {
      defineUnitId(unit) {
        this.model.unitId = unit.id;
      },
    },
  };
</script>
