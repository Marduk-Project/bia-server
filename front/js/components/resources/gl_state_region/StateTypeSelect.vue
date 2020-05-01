<template>
  <select class="form-control" :value="value" @change="onValueSelect">
    <option value="" v-if="showAll">Todos</option>
    <option value="meso">Mesorregião</option>
    <option value="micro">Microrregião</option>
    <option value="macro">Macrorregião</option>
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
      this.$emit("input", e.target.value);
    },
  },
};
</script>

<style scoped></style>
