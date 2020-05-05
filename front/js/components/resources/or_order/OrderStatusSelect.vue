<template>
  <select class="form-control" :value="value" @change="onValueSelect">
    <option value="0" v-if="showAll">Todos</option>
    <option value="1">1 - Nova</option>
    <option value="2">2 - Rejeitada na revisão</option>
    <option value="3">3 - Revisão OK</option>
    <option value="4">4 - Processada</option>
    <option value="9">9 - Cancelada</option>
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
      showIn: {
        type: Array,
      },
    },
    methods: {
      onValueSelect(e) {
        this.$emit('input', e.target.value);
      },
    },
  };
</script>

<style scoped></style>
