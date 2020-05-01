<template>
  <i
    class="fas fa-info-circle"
    v-b-tooltip.hover
    :title="title"
    @click.stop="onClick"
  ></i>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: false,
      },
    },
    methods: {
      onClick() {
        const text = this.details ? this.details : this.title;
        alert(text);
      },
    },
  };
</script>

<style scoped></style>
