<template>
  <span v-if="entity">{{ entity.name }}</span>
</template>

<script>
  export default {
    props: ['entity'],
  };
</script>

<style scoped></style>
