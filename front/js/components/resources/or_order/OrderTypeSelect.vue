<template>
  <select class="form-control" :value="value" @change="onValueSelect">
    <option value="0" v-if="showAll">Todos</option>
    <option value="1" v-if="showIn ? showIn.contains(1) : true"
      >1 - Solicitação</option
    >
    <option value="2" v-if="showIn ? showIn.contains(2) : true"
      >2 - Entrega</option
    >
    <option value="3" v-if="showIn ? showIn.contains(3) : true"
      >3 - Entrega futura</option
    >
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
