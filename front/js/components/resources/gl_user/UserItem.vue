<template>
  <span v-if="entity">{{ entity.name }} ({{ entity.email }})</span>
</template>

<script>
export default {
  props: ["entity"],
};
</script>

<style scoped></style>
