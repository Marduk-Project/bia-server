<template>
  <select class="form-control" :value="value" @change="onValueSelect">
    <option value="-1" v-if="showAll">Todos</option>
    <option value="0">0 - error</option>
    <option value="1">1 - warn</option>
    <option value="2">2 - info</option>
    <option value="3">3 - verbose</option>
    <option value="4">4 - debug</option>
    <option value="5">5 - silly</option>
  </select>
</template>

<script>
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
  },
  methods: {
    onValueSelect(e) {
      this.$emit('input', e.target.value);
    },
    levelToString(value) {
      value = parseInt(value);
      switch (value) {
        case exports.LEVEL_ERROR:
          return 'error';

        case exports.LEVEL_WARN:
          return 'warn';

        case exports.LEVEL_INFO:
          return 'info';

        case exports.LEVEL_DEBUG:
          return 'debug';

        case exports.LEVEL_SILLY:
          return 'silly';
      }
      return 'unknow';
    },
  },
};
</script>

<style scoped></style>
