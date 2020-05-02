<template>
  <b-container>
    <br />
    <b-button variant="link" @click="crud_navBack">
      <i class="fa fa-chevron-left" /> Voltar
    </b-button>
    <br />
    <h1>{{ crud_title }}</h1>
    <div v-if="isLoadingProducts" style="text-align: center;">
      Carregando lista de produtos...
    </div>
    <b-table v-else :items="productList" :fields="tableFields" hover striped>
      <template v-slot:cell(unit)="row">
        {{ row.item.unit.name }}
      </template>
      <template v-slot:cell(amount)="row">
        <b-form-input
          v-model="itemAmounts[row.item.id]"
          type="number"
          :min="0"
          class="input-quantity"
        />
        <b-button variant="link" role="button" @click="row.toggleDetails">
          <i class="far fa-sticky-note" role="presentation"></i>
          Adicionar comentário
        </b-button>
      </template>
      <template v-slot:row-details="row">
        <b-form-group
          label="Comentário:"
          :id="`fieldset-comment-${row.item.id}`"
          :label-for="`input-comment-${row.item.id}`"
        >
          <b-form-textarea
            :id="`input-comment-${row.item.id}`"
            v-if="itemNotes[row.item.id]"
            v-model="itemNotes[row.item.id]"
          />
          <b-form-textarea
            v-else
            :id="`input-comment-${row.item.id}`"
            placeholder="Adicione seu comentário para este item"
            @input="value => (itemNotes[row.item.id] = value)"
          />
        </b-form-group>
      </template>
    </b-table>

    <hr />
    <div>
      <p>
        O item que você procura não está na lista?
      </p>
      <b-button @click="$bvModal.show('or-request-new-product')">
        Cadastrar novo item
      </b-button>
      <RequestNewItemModal @save="note => (itemNotFoundNote = note)" />
    </div>
    <hr />
    <div :style="{ textAlign: 'right' }">
      <b-button @click="save">Avançar</b-button>
    </div>
  </b-container>
</template>

<script>
  import { crudMixin } from '@mixins/crud-mixin';
  import { mapActions, mapState } from 'vuex';

  import RequestNewItemModal from './RequestNewItemModal.vue';

  export default {
    mixins: [crudMixin],
    components: {
      RequestNewItemModal,
    },
    data() {
      return {
        // Form Data
        itemAmounts: {},
        itemNotes: {},
        itemNotFoundNote: '',
        previousStepData: {},

        // Table settings
        tableFields: [
          { key: 'name', label: 'Item' },
          { key: 'unit', label: 'Unidade' },
          { key: 'amount', label: 'Quantidade' },
        ],

        // Crud
        crud_title: 'Demanda de EPIs',
        crud_url_base: '/api/admin/gl_person',
        crud_route_base: 'gl_person',
      };
    },
    computed: {
      ...mapState('glProduct', {
        productList: 'list',
        isLoadingProducts: 'isLoading',
      }),
    },
    methods: {
      ...mapActions('glProduct', {
        loadProducts: 'load',
      }),
      save() {
        const dataForAPI = {
          ...this.previousStepData,
          items: this.itemAmounts,
          itemNotes: this.itemNotes,
          note: this.itemNotFoundNote,
        };
        console.log(JSON.stringify(dataForAPI, null, 2));
      },
    },
    mounted() {
      // Get parameters from previous page
      this.previousStepData = this.$router.currentRoute.params;
      if (Object.keys(this.previousStepData).length === 0) {
        this.$router.replace({ name: 'or_request.create' });
        return;
      }

      // Load Products and set object for amounts
      this.loadProducts().then(productList => {
        this.itemAmounts = productList.reduce((itemsAmount, item) => {
          itemsAmount[item.id] = 0;
          return itemsAmount;
        }, {});
      });
    },
  };
</script>

<style>
  .input-quantity {
    width: 4em;
  }
</style>
