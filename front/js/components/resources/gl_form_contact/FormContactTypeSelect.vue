<template>
  <select class="form-control" :value="value" @change="onValueSelect">
    <option value="0" v-if="showAll">Todos</option>
    <option value="" v-if="showEmpty">Selecione</option>
    <option v-for="item in options" :key="item" :value="item">{{
      valueToString(item)
    }}</option>
  </select>
</template>

<script>
  import {
    TYPE_ALL as OPTIONS,
    typeToString as valueToString,
  } from '@common/models/gl_form_contact';

  export default {
    props: {
      value: {
        type: [Number, String],
        required: false,
        default: null,
      },
      showAll: {
        type: Boolean,
        required: false,
        default: false,
      },
      showEmpty: {
        type: Boolean,
        required: false,
        default: false,
      },
      showOnly: {
        type: Array,
      },
    },
    methods: {
      onValueSelect(e) {
        this.$emit('input', e.target.value);
      },
      valueToString: valueToString,
    },
    computed: {
      options() {
        if (this.showOnly) {
          return OPTIONS.filter(item => this.showOnly.includes(item));
        }
        return OPTIONS;
      },
    },
  };
</script>

<style scoped></style>
