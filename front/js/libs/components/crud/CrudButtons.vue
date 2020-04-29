<template>
  <div class="form-row col-12 pt-1">
    <div class="form-group col-md-5 col-lg-4 col-xl-2">
      <button
        type="button"
        class="btn btn-success w-100"
        @click="onSaveClick"
        v-if="saveShow"
      >
        <i class="fas fa-check"></i> Salvar
      </button>
    </div>
    <div
      class="form-group col-md-5 col-lg-4 col-xl-2 offset-md-1"
      v-if="deleteShow"
    >
      <button type="button" class="btn btn-danger w-100" @click="onDeleteClick">
        <i class="fas fa-trash"></i> Excluir
      </button>
    </div>
    <app-delete-modal ref="modal" @ok="onDeleteAction"></app-delete-modal>
  </div>
</template>

<script>
  import DeleteModal from '@libComponents/crud/DeleteModal.vue';

  export default {
    components: {
      'app-delete-modal': DeleteModal,
    },
    props: {
      deleteShow: {
        type: Boolean,
        required: false,
        default: true,
      },
      saveShow: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
    methods: {
      onSaveClick() {
        this.$emit('onSave');
      },
      onDeleteClick() {
        this.$refs.modal.show();
      },
      onDeleteAction() {
        this.$emit('onDelete');
      },
    },
  };
</script>

<style scoped></style>
