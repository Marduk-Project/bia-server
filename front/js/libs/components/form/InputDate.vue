<template>
  <input
    :type="type"
    class="form-control"
    v-model="currentDate"
    :class="classes"
    :disabled="disabled"
    :readonly="readonly"
    v-b-tooltip.hover
    :title="currentDate ? moment(currentDate).fromNow() : '-'"
  />
</template>

<script>
import moment from 'moment';

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'date',
    },
    value: {
      type: [Date, String],
      required: false,
      default: null,
    },
    classes: {
      type: [String, Array, Object],
      required: false,
      default: '',
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
  data() {
    return {
      currentDate: this.value ? moment(this.value).format('YYYY-MM-DD') : null,
      currentDateChangeIgnore: false,
      valueChangeIgnore: false,
    };
  },
  watch: {
    value(value) {
      if (this.valueChangeIgnore) {
        this.valueChangeIgnore = false;
      } else {
        this.currentDateChangeIgnore = true;
        this.currentDate = moment(value).format('YYYY-MM-DD');
      }
    },
    currentDate(value) {
      if (this.currentDateChangeIgnore) {
        this.currentDateChangeIgnore = false;
      } else {
        this.valueChangeIgnore = true;
        this.$emit('input', value);
      }
    },
  },
  methods: {
    moment(date) {
      return moment(date);
    },
  },
};
</script>

<style scoped></style>
