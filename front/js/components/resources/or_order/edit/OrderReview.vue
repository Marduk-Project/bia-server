<template>
  <div>
    <b-table
      :items="entityDetails"
      :fields="entityTableFields"
      stacked
      striped
    />

    <b-table
      :items="selectedProductsList"
      :fields="productTableFields"
      hover
      striped
    >
      <template v-slot:cell(quantity)="row">
        <label :for="`input-product-quantity-${row.item.id}`">
          {{ row.item.quantity }} - {{ row.item.unit }}
        </label>
      </template>
    </b-table>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    props: {
      entities: {
        type: Object,
        default: () => ({
          originPerson: {},
          originPersonContact: {},
          destinationPerson: {},
          destinationPersonContact: {},
        }),
      },
      products: {
        type: Array,
        default: () => [],
      },
      notes: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        // Table Settings
        entityTableFields: [
          { key: 'originPerson', label: 'Entidade' },
          {
            key: 'originPersonContact',
            label: 'Pessoa de contato na Entidade',
          },
          { key: 'destinationPerson', label: 'Entidade de destino' },
          {
            key: 'destinationPersonContact',
            label: 'Pessoa de contato na entidade destino',
          },
          {
            key: 'notes',
            label: 'Comentários',
          },
        ],
        productTableFields: [
          { key: 'name', label: 'Item' },
          { key: 'quantity', label: 'Quantidade' },
          { key: 'notes', label: 'Comentários' },
        ],
      };
    },
    computed: {
      ...mapState('glProduct', { productList: 'list' }),
      entityDetails() {
        return [
          {
            originPerson: this.entities.originPerson.name,
            originPersonContact: this.entities.originPersonContact.name,
            destinationPerson: this.entities.destinationPerson.name,
            destinationPersonContact: this.entities.destinationPersonContact
              .name,
            notes: this.notes,
          },
        ];
      },
      selectedProductsList() {
        return this.products.map(product => {
          const productData = this.productList.find(
            x => x.id === product.glProductId
          );
          return {
            ...product,
            name: productData.name,
            unit: productData.unit.name,
          };
        });
      },
    },
  };
</script>
