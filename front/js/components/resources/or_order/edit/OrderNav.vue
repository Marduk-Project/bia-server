<template>
  <div>
    <button
      v-if="hasPrevious"
      type="button"
      class="btn btn-outline-secondary float-left"
      @click="$emit('previous')"
    >
      <i class="fas fa-arrow-left"></i> Voltar
    </button>
    <button
      v-if="hasNext"
      type="button"
      @click="$emit('next')"
      class="btn btn-outline-success float-right"
    >
      <i class="fas fa-arrow-right"></i> Avançar
    </button>
    <div class="clearfix"></div>
  </div>
</template>

<script>
  export default {
    props: {
      hasNext: {
        type: Boolean,
        default: true,
      },
      hasPrevious: {
        type: Boolean,
        default: true,
      },
    },
  };
</script>

<style></style>
