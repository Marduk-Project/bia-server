<template>
  <b-container>
    <div v-if="isLoadingProducts" style="text-align: center;">
      Carregando lista de produtos...
    </div>
    <b-table v-else :items="productList" :fields="tableFields" hover striped>
      <template v-slot:cell(name)="row">
        <label :for="`input-product-quantity-${row.item.id}`">
          {{ row.item.name }}
        </label>
      </template>

      <template v-slot:cell(unit)="row">
        <label :for="`input-product-quantity-${row.item.id}`">
          {{ row.item.unit.name }}
        </label>
      </template>

      <template v-slot:cell(amount)="row">
        <b-form-input
          v-model="itemsById[row.item.id].quantity"
          :id="`input-product-quantity-${row.item.id}`"
          type="number"
          :min="0"
          class="input-quantity"
          @input="triggerChange"
        />
      </template>

      <template v-slot:cell(actions)="row">
        <i
          class="far fa-sticky-note fa-lg"
          role="button"
          @click="row.toggleDetails"
          v-b-tooltip.hover
          title="Adicione um comentário"
        />
      </template>

      <template v-slot:row-details="row">
        <b-form-group
          :label="`Comentário sobre o item ${row.item.name}:`"
          :id="`fieldset-comment-${row.item.id}`"
          :label-for="`input-comment-${row.item.id}`"
        >
          <b-form-textarea
            :id="`input-comment-${row.item.id}`"
            v-model="itemsById[row.item.id].notes"
            placeholder="Adicione seu comentário para este item"
            @input="triggerChange"
          />
        </b-form-group>
      </template>
    </b-table>
  </b-container>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    props: {
      value: { Array, default: () => [] },
    },
    data() {
      return {
        // Data
        quantityById: {},
        notesById: {},

        // Table settings
        tableFields: [
          { key: 'name', label: 'Item' },
          { key: 'unit', label: 'Unidade' },
          { key: 'amount', label: 'Quantidade' },
          { key: 'actions', label: '' },
        ],
      };
    },
    computed: {
      ...mapState('glProduct', {
        productList: 'list',
        isLoadingProducts: 'isLoading',
      }),
      itemsById() {
        return this.productList.reduce((list, product) => {
          const valueForProduct =
            (this.value &&
              this.value.find(x => x.glProductId === product.id)) ||
            {};

          list[product.id] = {
            quantity: valueForProduct.quantity || 0,
            notes: valueForProduct.notes || '',
          };
          return list;
        }, {});
      },
      itemsNormalized() {
        return Object.keys(this.itemsById)
          .map(productId => ({
            glProductId: Number(productId),
            quantity: Number(this.itemsById[productId].quantity),
            notes: this.itemsById[productId].notes.trim(),
          }))
          .filter(item => item.quantity || item.notes);
      },
    },
    methods: {
      ...mapActions('glProduct', {
        loadProducts: 'load',
      }),
      triggerChange() {
        this.$emit('input', this.itemsNormalized);
      },
    },
    beforeMount() {
      this.loadProducts();
    },
  };
</script>

<style scoped>
  .fa-sticky-note {
    cursor: pointer;
    margin-top: 12px;
  }
</style>
