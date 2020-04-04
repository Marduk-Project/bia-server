<template>
  <select class="form-control" :value="value" @change="onValueSelect">
    <option value="0" v-if="showAll">Todos</option>
    <option value="10">10 - Administrador</option>
    <option value="15">15 - Gestor</option>
    <option value="20">20 - Usuário</option>
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
