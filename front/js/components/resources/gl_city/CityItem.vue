<template>
  <span v-if="entity">{{
    entity.state ? `${entity.name} - ${entity.state.code}` : `${entity.name}`
  }}</span>
</template>

<script>
export default {
  props: ['entity'],
}
</script>

<style scoped></style>
