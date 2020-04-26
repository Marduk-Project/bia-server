<template>
  <div>
    <b-modal
      ref="modal"
      ok-variant="danger"
      ok-title="Excluir"
      cancel-title="Cancelar"
      :hide-header="title ? false : true"
      :title="title"
      @ok="onDeleteClick"
      @cancel="onCancelClick"
      >Excluir registro?</b-modal
    >
  </div>
</template>

<script>
export default {
  props: ["title", "value"],
  methods: {
    onDeleteClick() {
      this.$emit("ok", this.value);
    },
    onCancelClick() {
      this.$emit("cancel", this.value);
    },
    show() {
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
  },
};
</script>

<style scoped></style>
