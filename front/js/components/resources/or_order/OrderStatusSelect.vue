<template>
  <select class="form-control" :value="value" @change="onValueSelect">
    <option value="0" v-if="showAll">Todos</option>
    <option value="" v-if="showEmpty">Selecione</option>
    <option v-for="item in options" :key="item" :value="item"
      >{{ item }} - {{ valueToString(item) }}</option
    >
  </select>
</template>

<script>
  import { STATUS_ALL, statusToString } from '@common/models/or_order';

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
      valueToString: statusToString,
    },
    computed: {
      options() {
        if (this.showOnly) {
          return STATUS_ALL.filter(item => this.showOnly.includes(item));
        }
        return STATUS_ALL;
      },
    },
  };
</script>

<style scoped></style>
