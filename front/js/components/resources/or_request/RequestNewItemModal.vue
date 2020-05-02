<template>
  <b-modal
    id="or-request-new-product"
    ok-variant="success"
    ok-title="Salvar"
    cancel-title="Cancelar"
    @ok="() => $emit('save', note)"
  >
    <template v-slot:modal-title>Não encontrou o que procura?</template>
    <b-form-textarea
      v-model="note"
      id="or-request-new-product__textarea"
      placeholder="Descreva o(s) produto(s) que você não encontrou, e a quantidade desejada."
      rows="3"
      max-rows="6"
    />
  </b-modal>
</template>

<script>
  export default {
    data() {
      return {
        note: '',
      };
    },
  };
</script>
