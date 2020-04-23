<template>
  <tr>
    <td>{{ field.field.name }}</td>
    <td v-if="type == 1">
      <input
        class="form-control"
        :type="input_type"
        @input="onValueChange"
        :value="input_value"
        :class="input_classes"
      />
    </td>
    <td v-if="type == 2 || type == 3">
      <input
        class="form-control"
        :type="input_type"
        @input="onValueChange"
        :value="input_value"
        :class="input_classes"
        :step="type == 2 ? '1' : '0.01'"
      />
    </td>
    <td v-if="type == 4">
      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" :checked="field.valueBoolean" value="1" @input="onCheckBoxChange" />
            {{ field.field.name }}
          </label>
        </div>
      </div>
    </td>
    <td v-if="type == 5">
      <app-field-item-select
        :value="field.fieldItem"
        @input="onSelectChanged"
        :extraparams="{ fieldId: field.field.id }"
      ></app-field-item-select>
    </td>
  </tr>
</template>

<script>
import axios from "../../../libs/mixins/axios-auth";
import FieldItemSelect from "../gl_field_item/FieldItemSelect.vue";

export default {
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  components: {
    "app-field-item-select": FieldItemSelect
  },
  data() {
    return {};
  },
  methods: {
    onValueChange(value) {
      this.emitValueEvent(value.target.value);
    },
    onSelectChanged(value) {
      this.emitValueEvent(value);
    },
    onCheckBoxChange(value) {
      this.emitValueEvent(value.target.checked);
    },
    emitValueEvent(value) {
      const ret = Object.assign({}, this.field);
      ret.fieldItemId = null;
      ret.fieldItem = null;
      ret.valueString = null;
      switch (parseInt(this.type)) {
        case 1:
          ret.valueString = value;
          break;

        case 2:
          ret.valueInt = parseFloat(value);
          if (!ret.valueInt) {
            ret.valueInt = 0;
          }
          break;

        case 3:
          ret.valueDouble = parseFloat(value);
          if (!ret.valueDouble) {
            ret.valueDouble = 0;
          }
          break;

        case 4:
          ret.valueBoolean = value;
          break;

        case 5:
          if (value) {
            ret.fieldItemId = value.id;
            ret.fieldItem = value;
            ret.valueString = value.value;
          }
          break;
      }
      this.$emit("input", ret);
    }
  },
  computed: {
    type() {
      return this.field.field.type;
    },
    input_type() {
      switch (parseInt(this.type)) {
        case 1:
          return "text";

        case 2:
        case 3:
          return "number";

        case 4:
          return null;

        case 5:
          return null;
      }
    },
    input_value() {
      switch (parseInt(this.type)) {
        case 1:
          return this.field.valueString;

        case 2:
          return this.field.valueInt;

        case 3:
          return this.field.valueDouble;

        case 4:
          return this.field.valueBoolean;

        case 5:
          return null;
      }
    },
    input_classes() {
      switch (parseInt(this.type)) {
        case 1:
          return "col-lg-6";

        case 2:
        case 3:
          return "col-lg-3";

        case 4:
          return null;

        case 5:
          return null;
      }
    }
  }
};
</script>

<style scoped>
</style>
