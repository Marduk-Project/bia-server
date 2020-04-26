<template>
  <span>
    {{ preffix }} {{ parseFloat(value ? value : 0).toFixed(decimal) }}
    {{ suffix }}
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      required: false,
      default: 0,
    },
    decimal: {
      type: Number,
      required: false,
      default: 2,
    },
    preffix: {
      type: String,
      required: false,
      default: "",
    },
    suffix: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script>

<style scoped></style>
