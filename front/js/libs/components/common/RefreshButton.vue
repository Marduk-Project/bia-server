<template>
  <button
    class="btn btn-outline-secondary"
    :disabled="isLoading"
    @click="onButtonClick"
  >
    <i class="fas fa-sync" :class="{ 'fa-spin': isLoading }"></i> Atualizar
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
  computed: {
    ...mapGetters({
      isLoading: 'isLoading',
    }),
  },
};
</script>

<style scoped></style>
