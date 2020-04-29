<template>
  <select
    class="form-control"
    :name="name"
    :value="value"
    @change="onValueSelect"
    :class="classes"
  >
    <option value v-if="showAll">Todos</option>
    <option value="gl_person">Pessoas</option>
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
