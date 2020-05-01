<template>
  <select
    name="weekday"
    @input="$emit('input', $event.target.value)"
    class="form-control"
    v-validate="required ? 'required' : ''"
    :class="{ 'is-invalid': errors.has('weekday') }"
  >
    <option value="-1" :selected="value == -1" v-if="showAll">Todos</option>
    <option value="1" :selected="value == 1">Segunda-feira</option>
    <option value="2" :selected="value == 2">Terça-feira</option>
    <option value="3" :selected="value == 3">Quarta-feira</option>
    <option value="4" :selected="value == 4">Quinta-feira</option>
    <option value="5" :selected="value == 5">Sexta-feira</option>
    <option value="6" :selected="value == 6">Sábado</option>
    <option value="0" :selected="value == 0">Domingo</option>
  </select>
</template>

<script>
  export default {
    props: {
      showAll: {
        type: Boolean,
        default: false,
        required: false,
      },
      value: {
        type: [String, Number],
        default: 0,
        required: false,
      },
      required: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    methods: {},
  };
</script>

<style scoped></style>
