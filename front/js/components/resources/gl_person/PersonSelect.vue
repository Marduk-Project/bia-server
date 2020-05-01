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
    url="/api/admin/gl_person"
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
    props: [
      'elid',
      'readonly',
      'disabled',
      'name',
      'required',
      'url',
      'value',
      'options',
      'extraparams',
      'placeholder',
      'multiple',
    ],
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
