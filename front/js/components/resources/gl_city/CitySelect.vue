<template>
  <v-select
    :id="id"
    :elid="elid"
    :readonly="readonly"
    :disabled="disabled"
    :name="name ? name : 'gl_city_id'"
    :value="value"
    :required="required"
    :options="options"
    :extraparams="extraparams"
    :placeholder="placeholder"
    :mapResult="mapResult"
    url="/api/admin/gl_city"
    @onOpen="$emit('onOpen')"
    @onClose="$emit('onClose')"
    @onSelect="$emit('onSelect', $event)"
    @onUnselect="$emit('onUnselect', $event)"
    @input="$emit('input', $event)"
    @onChange="$emit('onChange', $event)"
  ></v-select>
</template>

<script>
  import vSelect from '@libComponents/form/Select2.vue';

  export default {
    props: {
      id: { type: String },
      elid: { type: Number, default: null },
      readonly: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      name: { type: String },
      required: { type: Boolean, default: false },
      url: { type: String },
      value: { type: [Object, String] },
      options: { type: Array },
      extraparams: { type: Object },
      placeholder: { type: String },
    },
    components: {
      'v-select': vSelect,
    },
    methods: {
      mapResult(value, index) {
        if (value.state) {
          value.text = `${value.name} - ${value.state.initials}`;
        } else {
          value.text = value.name;
        }
        return value;
      },
    },
  };
</script>

<style scoped></style>
