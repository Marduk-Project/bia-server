<template>
  <button class="btn btn-outline-secondary" @click="onButtonClick">
    <i class="fa fa-plus"></i> Adicionar
  </button>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: ['value'],
  methods: {
    onButtonClick() {
      this.$emit('click', this.value);
    },
  },
};
</script>

<style scoped></style>
