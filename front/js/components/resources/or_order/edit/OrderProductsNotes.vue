<template>
  <div>
    <p>
      O item que você procura não está na lista?
    </p>
    <b-button
      variant="outline-secondary"
      @click="() => (isModalVisible = true)"
    >
      Adicionar observações
    </b-button>

    <b-modal
      id="or-request-new-product"
      v-model="isModalVisible"
      ok-variant="success"
      ok-title="Salvar"
      cancel-title="Cancelar"
      @cancel="() => (note = '')"
      @ok="save"
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
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        _note: '',
        isModalVisible: false,
      };
    },
    computed: {
      note: {
        get() {
          return this._note || this.value;
        },
        set(value) {
          this._note = value;
        },
      },
    },
    methods: {
      save() {
        this.$emit('input', this._note);
        this._note = '';
      },
    },
  };
</script>
