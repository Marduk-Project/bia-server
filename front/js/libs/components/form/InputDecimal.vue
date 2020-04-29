<template>
  <input
    type="number"
    :step="step"
    class="form-control text-right"
    :value="parseFloat(value ? value : 0).toFixed(decimal)"
    :class="classes"
    :disabled="disabled"
    :readonly="readonly"
    @change="$emit('input', $event.target.value)"
  />
</template>

<script>
import moment from 'moment'

export default {
  props: {
    value: {
      type: [String, Number],
      required: false,
      default: 0,
    },
    decimal: {
      type: Number,
      required: false,
      default: 2,
    },
    classes: {
      type: [String, Object, Array],
      required: false,
      default: '',
    },
    step: {
      type: String,
      required: false,
      default: '0.01',
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    moment(date) {
      return moment(date)
    },
  },
}
</script>

<style scoped></style>
