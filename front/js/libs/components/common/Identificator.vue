<template>
  <i class="fas fa-hashtag" v-b-tooltip.hover :title="title" @click.stop="onClick"></i>
</template>

<script>
export default {
  props: {
    title: {
      type: [String, Number],
      required: true
    },
    details: {
      type: [String. Number],
      required: false
    }
  },
  methods: {
    onClick() {
      const text = this.details ? this.details : `ID: ${this.title}`;
      alert(text);
    }
  }
};
</script>

<style scoped>
</style>