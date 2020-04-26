<template functional>
  <span v-if="entity">{{ entity.name }} ({{ entity.email }})</span>
</template>

<script>
export default {
  props: {
    entity: {
      type: Object,
      validator: (entity) => Boolean(entity.name && entity.email),
    },
  },
};
</script>

<style scoped></style>
