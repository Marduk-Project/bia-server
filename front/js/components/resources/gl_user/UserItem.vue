<template>
  <span>
    <span v-if="entity">{{ entity.name }} ({{ entity.email }})</span>
  </span>
</template>

<script>
  export default {
    props: {
      entity: {
        type: Object,
        required: false,
      },
    },
  };
</script>

<style scoped></style>
