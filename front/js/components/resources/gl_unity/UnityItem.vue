<template>
  <span
    v-if="entity"
    v-b-tooltip.hover
    :title="entity ? entity.name : 'Sem unidade definida.'"
  >{{ entity ? `${entity.unity}` : '-' }}</span>
</template>

<script>
export default {
  props: ["entity"]
};
</script>

<style scoped>
</style>
