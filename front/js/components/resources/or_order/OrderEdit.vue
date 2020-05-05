<template>
  <div class="container" v-if="entity && appContext">
    <br />
    <button type="button" class="btn btn-link" @click="onNavBackClick">
      <i class="fa fa-chevron-left" /> Voltar
    </button>
    <br />
    <h1>{{ crud_title }}</h1>
    <b-tabs content-class="mt-3" v-model="tabIndex">
      <b-tab title="Informações da Entidade de destino" active>
        <app-order-nav
          :hasNext="tabIndex < TAB_REVIEW"
          :hasPrevious="tabIndex > 0"
          @previous="onNavBackClick"
          @next="onNavNextClick"
        ></app-order-nav>
        <app-order-person
          :entity="entity"
          @input="onPersonInputUpdate"
          ref="personComponent"
        ></app-order-person>
        <div class="form-row">
          <div class="form-group col-lg-12">
            <label for="input-notes">
              Observações adicionais
            </label>
            <b-form-textarea
              id="input-notes"
              v-model="entity.notes"
              :rows="3"
              maxlength="1000"
              placeholder="Descreva de recebimento, envio, produtos não encontrados ou o que julgar necessário."
            />
          </div>
        </div>
      </b-tab>
      <b-tab title="Produtos">
        <app-order-nav
          :hasNext="tabIndex < TAB_REVIEW"
          :hasPrevious="tabIndex > 0"
          @previous="onNavBackClick"
          @next="onNavNextClick"
        ></app-order-nav>
        <br />
        <app-order-products :entity="entity" @input="onProductInputUpdate" />
        <hr />
        <app-order-products-notes v-model="entity.notes" />
      </b-tab>
      <b-tab title="Revisar" :disabled="!isFormFilledOK">
        <app-order-nav
          :hasNext="tabIndex < TAB_REVIEW"
          :hasPrevious="tabIndex > 0"
          @previous="onNavBackClick"
          @next="onNavNextClick"
        ></app-order-nav>
        <br />
        <app-order-review :entity="entity" />
      </b-tab>
    </b-tabs>

    <hr />
    <div :style="{ textAlign: 'right' }" v-if="tabIndex === TAB_REVIEW">
      <button type="button" class="btn btn-success" @click="submit">
        <i class="fas fa-check"></i> Enviar
      </button>
    </div>
    <app-order-nav
      v-else
      :hasNext="tabIndex < TAB_REVIEW"
      :hasPrevious="tabIndex > 0"
      @previous="onNavBackClick"
      @next="onNavNextClick"
    ></app-order-nav>
  </div>
</template>

<script>
  import { crudMixin } from '@mixins/crud-mixin';

  import { mapState, mapActions, mapGetters } from 'vuex';

  import OrderNav from './edit/OrderNav.vue';
  import OrderPerson from './edit/OrderPerson.vue';
  import OrderProducts from './edit/OrderProducts.vue';
  import OrderReview from './edit/OrderReview.vue';
  import OrderProductsNotes from './edit/OrderProductsNotes.vue';
  import PersonSelect from '@resources/gl_person/PersonSelect.vue';
  import PersonContactSelect from '@resources/gl_person_contact/PersonContactSelect.vue';

  export default {
    mixins: [crudMixin],
    components: {
      'app-order-nav': OrderNav,
      'app-order-person': OrderPerson,
      'app-order-products': OrderProducts,
      'app-order-review': OrderReview,
      'app-order-products-notes': OrderProductsNotes,
      'app-person-select': PersonSelect,
      'app-person-contact-select': PersonContactSelect,
    },
    data() {
      return {
        entity: {
          id: null,
          type: null,
          status: null,
          glPersonOrigin: null,
          glPersonContactOrigin: null,
          glPersonDestination: null,
          glPersonContactDestination: null,
          notes: '',
          items: [],
        },
        // Tabs
        tabIndex: 0,
        TAB_PERSONS: 0,
        TAB_PRODUCTS: 1,
        TAB_REVIEW: 2,
      };
    },
    computed: {
      ...mapState({
        personContactList: 'personContactList',
        isContextAccount: 'isContextAccount',
        appContext: 'context',
      }),
      ...mapGetters(['isUserStaff']),
      isFormFilledOK() {
        if (!this.entity.glPersonOrigin) {
          return false;
        }
        if (!this.entity.glPersonContactOrigin) {
          return false;
        }
        if (!this.entity.glPersonDestination) {
          return false;
        }
        if (!this.entity.glPersonContactDestination) {
          return false;
        }
        return this.entity.items.length > 0;
      },
      crud_title() {
        if (this.id) {
          return `Ordem #${this.entity.id}`;
        } else {
          return 'Cadastro de Solicitação & Entrega';
        }
      },
      crud_url_base() {
        return `/api/account/or_order`;
      },
      crud_route_base() {
        return 'or_order';
      },
    },
    mounted() {
      this.updatePersonState();
    },
    watch: {
      personContactList(newValue, oldValue) {
        this.updatePersonState();
      },
    },
    methods: {
      onNavBackClick() {
        if (this.tabIndex != this.TAB_PERSONS) {
          this.tabIndex--;
        } else {
          this.crud_navBack();
        }
      },
      async onNavNextClick() {
        switch (this.tabIndex) {
          case this.TAB_PERSONS:
            if (!(await this.$refs.personComponent.validate())) {
              return;
            }
            break;

          case this.TAB_PRODUCTS:
            if (this.entity.items.length == 0) {
              this.notify_warning('Selecione pelo menos um produto.');
              return;
            }
            break;

          case this.TAB_REVIEW:
            return;
        }
        this.tabIndex++;
      },
      onPersonInputUpdate(value) {
        setTimeout(() => {
          Object.assign(this.entity, value);
        }, 1);
      },
      onProductInputUpdate(value) {
        this.entity.items = value.items;
      },
      onPersonChangeCheck() {
        if (!this.entity.glPersonOrigin) {
          this.entity.glPersonContactOrigin = null;
        }
        if (!this.entity.glPersonDestination) {
          this.entity.glPersonContactDestination = null;
        }
      },
      updatePersonState() {
        if (
          this.personContactList.length == 1 &&
          !this.id &&
          this.isContextAccount
        ) {
          this.entity.glPersonOrigin = this.personContactList[0].person;
          this.entity.glPersonContactOrigin = this.personContactList[0];
          this.entity.glPersonDestination = this.personContactList[0].person;
          this.entity.glPersonContactDestination = this.personContactList[0];
        }
      },
      submit() {
        alert(
          JSON.stringify(
            {
              glPersonOriginId: this.entity.glPersonOrigin.id,
              glPersonContactOriginId: this.entity.glPersonContactOrigin.id,
              glPersonDestinationId: this.entity.glPersonDestination.id,
              glPersonContactDestinationId: this.entity
                .glPersonContactDestination.id,
              items: this.entity.items.map(item => {
                return {
                  'mapear aqui': true,
                };
              }),
              notes: this.entity.notes,
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
