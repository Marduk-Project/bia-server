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
        <app-order-entity
          v-model="entities"
          :personId="personId"
          :personContactId="personContactId"
          @submit="nextTab"
        />

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
          :notes="notes"
        />
      </b-tab>
    </b-tabs>

    <hr />
    <div :style="{ textAlign: 'right' }">
      <b-button v-if="tabIndex === TAB_REVIEW" @click="submit">
        Enviar Pedido
      </b-button>
      <b-button v-else @click="nextTab">
        Avançar
      </b-button>
    </div>
  </b-container>
</template>

<script>
  import { crudMixin } from '@mixins/crud-mixin';

  import { mapState, mapActions } from 'vuex';

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
            glPersonOriginId: null,
            glPersonContactOriginId: null,
            glPersonDestinationId: null,
            glPersonContactDestinationId: null,
          },
          data: {
            glPersonOrigin: null,
            glPersonContactOrigin: null,
            glPersonDestination: null,
            glPersonContactDestination: null,
          },
        },
        products: [],
        notes: '',

        // Tabs
        tabIndex: 0,
        TAB_ENTITY: 0,
        TAB_PRODUCTS: 1,
        TAB_REVIEW: 2,
      };
    },
    computed: {
      ...mapState(['personContactList']),
      personId() {
        if (this.personContactList && this.personContactList.length === 1) {
          return this.personContactList[0].person.id;
        }
      },
      personContactId() {
        if (this.personContactList && this.personContactList.length === 1) {
          return this.personContactList[0].id;
        }
      },
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
              items: this.products,
              notes: this.notes,
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
