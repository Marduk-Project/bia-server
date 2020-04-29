<template>
  <select
    class="form-control"
    :name="name"
    :value="value"
    @change="onValueSelect"
    :class="classes"
  >
    <option value="0" v-if="showAll">Todos</option>
    <option value="1">Texto (String)</option>
    <option value="2">Inteiro (Int)</option>
    <option value="3">Número com virgula (Double)</option>
    <option value="4">Checkbox (Boolean)</option>
    <option value="5">Com itens (Select)</option>
  </select>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: false,
      default: 'type',
    },
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
    classes: {
      type: [String, Object],
      required: false,
      default: '',
    },
  },
  methods: {
    onValueSelect(e) {
      this.$emit('input', e.target.value)
    },
  },
}
</script>

<style scoped></style>
