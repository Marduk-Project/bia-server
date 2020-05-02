<template>
  <v-select
    :elid="elid"
    :readonly="readonly"
    :disabled="disabled"
    :name="name ? name : 'user'"
    :value="value"
    :required="required"
    :options="options"
    :extraparams="extraparams"
    :placeholder="placeholder"
    :mapResult="mapResult"
    :multiple="multiple"
    :id="id"
    url="/api/admin/gl_person_contact"
    @onOpen="$emit('onOpen')"
    @onClose="$emit('onClose')"
    @onSelect="$emit('onSelect', $event)"
    @onUnselect="$emit('onUnselect', $event)"
    @input="$emit('input', $event)"
    @onChange="$emit('onChange', $event)"
  ></v-select>
</template>

<script>
  // Filter by parent

  import vSelect from '@libComponents/form/Select2.vue';

  export default {
    props: {
      id: { type: String },
      elid: { type: String },
      name: { type: String },
      url: { type: String },
      value: { type: Object },
      placeholder: { type: String },
      options: { type: Array, default: () => [] },
      extraparams: { type: Array, default: () => [] },
      readonly: { type: Boolean },
      disabled: { type: Boolean },
      required: { type: Boolean },
      multiple: { type: Boolean },
    },
    components: {
      'v-select': vSelect,
    },
    methods: {
      mapResult(value, index) {
        if (value.shortname) {
          value.text = `${value.shortname} - (${value.name})`;
        } else {
          value.text = `${value.name}`;
        }
        return value;
      },
    },
  };
</script>

<style scoped></style>
