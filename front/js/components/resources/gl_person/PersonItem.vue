<template>
  <span v-if="entity">{{
    entity.city ? `${entity.name} - (${entity.city.name})` : entity.name
  }}</span>
</template>

<script>
  export default {
    props: ['entity'],
  };
</script>

<style scoped></style>
