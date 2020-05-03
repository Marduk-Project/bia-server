<template>
  <b-container>
    <br />

    <b-button variant="link" @click="crud_navBack">
      <i class="fa fa-chevron-left" /> Voltar
    </b-button>

    <br />

    <h1>Demanda de EPIs</h1>

    <b-tabs content-class="mt-3" v-model="tabIndex">
      <b-tab title="Entidade" active>
        <app-order-entity v-model="entities" @submit="nextTab" />

        <div class="form-row">
          <div class="form-group col-lg-12">
            <label for="input-notes">
              Observações
            </label>
            <b-form-textarea
              id="input-notes"
              v-model="notes"
              :rows="4"
              placeholder="Descreva a situação do recebimento de materiais em sua entidade"
            />
          </div>
        </div>
      </b-tab>
      <b-tab title="Itens" lazy>
        <app-order-products-table v-model="products" />

        <hr />
        <app-order-products-notes v-model="notes" />
      </b-tab>
      <b-tab title="Revisão" lazy :disabled="!formFilled">
        <app-order-review
          :entities="entities.data"
          :products="products"
          :notes="entities.notes"
        />
      </b-tab>
    </b-tabs>

    <hr />
    <div :style="{ textAlign: 'right' }">
      <b-button v-if="tabIndex < 3" @click="nextTab">
        Avançar
      </b-button>
      <b-button v-else @click="submit">
        Enviar Pedido
      </b-button>
    </div>
  </b-container>
</template>

<script>
  import { crudMixin } from '@mixins/crud-mixin';

  import OrderEntity from './edit/OrderEntity.vue';
  import OrderProductsTable from './edit/OrderProductsTable.vue';
  import OrderReview from './edit/OrderReview.vue';
  import OrderProductsNotes from './edit/OrderProductsNotes.vue';

  export default {
    mixins: [crudMixin],
    components: {
      'app-order-entity': OrderEntity,
      'app-order-products-table': OrderProductsTable,
      'app-order-review': OrderReview,
      'app-order-products-notes': OrderProductsNotes,
    },
    data() {
      return {
        // Form Data
        entities: {
          ids: {
            originPersonId: null,
            originPersonContactId: null,
            destinationPersonId: null,
            destinationPersonContactId: null,
          },
          data: {
            originPerson: null,
            originPersonContact: null,
            destinationPerson: null,
            destinationPersonContact: null,
          },
        },
        products: [],
        notes: '',

        // Tabs
        tabIndex: 0,
      };
    },
    computed: {
      formFilled() {
        return (
          this.entities.ids &&
          Object.values(this.entities.ids).filter(x => x).length > 0 &&
          this.products.length > 0
        );
      },
    },
    methods: {
      nextTab() {
        this.tabIndex++;
      },
      submit() {
        alert(
          JSON.stringify(
            {
              ...this.entities.ids,
              ...this.products,
              notes: this.entities.notes,
            },
            null,
            2
          )
        );
      },
    },
  };
</script>

<style></style>
