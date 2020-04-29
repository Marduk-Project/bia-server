<template>
  <span v-if="value" v-b-tooltip.hover :title="moment(value).fromNow()">
    <span class="d-print-none">{{ moment(value).format('L LTS') }}</span>
    <span class="d-print-inline d-none">{{
      moment(value).format('L LTS')
    }}</span>
  </span>
</template>

<script>
import moment from 'moment';

export default {
  props: ['value', 'modDate', 'createdDate'],
  methods: {
    moment(value) {
      return moment(value);
    },
  },
};
</script>

<style scoped></style>
