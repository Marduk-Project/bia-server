<template>
  <select class="form-control" :value="value" @change="onValueSelect">
    <option value="0" v-if="showAll">Todos</option>
    <option value="1">1 - Física</option>
    <option value="2">2 - Jurídica</option>
    <option value="3">3 - Grupo organizado</option>
  </select>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      required: false,
      default: null
    },
    showAll: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    onValueSelect(e) {
      this.$emit("input", e.target.value);
    }
  }
};
</script>

<style scoped>
</style>
