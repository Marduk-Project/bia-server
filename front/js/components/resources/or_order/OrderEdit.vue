<template>
  <div class="container-fluid" v-if="entity && appContext">
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
              :rows="2"
              maxlength="1000"
              placeholder="Descreva de recebimento, envio, produtos não encontrados ou o que julgar necessário."
            />
            <div v-if="isUserStaff">
              <br />
              <br />
              <div class="card card-body">
                <h4>Informações administrativas</h4>
                <div class="form-row">
                  <div class="form-group col-4">
                    <label for="input-status">
                      Situação
                    </label>
                    <app-order-status-select
                      v-model="entity.status"
                    ></app-order-status-select>
                  </div>
                  <div class="form-group col-4">
                    <label>
                      Criado por
                    </label>
                    <app-user-select
                      :disabled="true"
                      :value="id ? entity.glUser : user"
                    ></app-user-select>
                  </div>
                  <div class="form-group col-4">
                    <label>
                      Categoria
                    </label>
                    <app-order-category-select
                      v-model="entity.orderCategory"
                    ></app-order-category-select>
                  </div>
                  <div class="form-group col-12">
                    <label>Anotações internas</label>
                    <textarea
                      class="form-control"
                      placeholder="Informe alterações e demais informações de revisão aqui"
                      maxlength="1000"
                      v-model="entity.internalNotes"
                      rows="2"
                    />
                    <small
                      >Esta anotações
                      <strong
                        >não aparecerão para o usuário não
                        administrativos.</strong
                      ></small
                    >
                  </div>
                  <div class="form-group col-12">
                    <div class="form-check">
                      <label
                        class="form-check-label"
                        :class="{ 'text-danger': entity.needsReview }"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value="1"
                          v-model="entity.needsReview"
                        />
                        Ordem precisa de revisão.
                      </label>
                    </div>
                  </div>
                  <div class="form-group col-3">
                    <label>Data efetiva</label>
                    <app-input-date
                      name="effectiveDate"
                      v-validate="'required'"
                      v-model="entity.effectiveDate"
                      :classes="{
                        'is-invalid': errors.has('effectiveDate'),
                      }"
                    ></app-input-date>
                    <small>Data efetiva da entrega ou da solicitação.</small>
                    <div class="invalid-feedback">Campo obrigatório.</div>
                  </div>
                </div>
              </div>
            </div>
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
        <app-order-review :entity="entity" @onNotesUpdate="onNotesUpdate" />
      </b-tab>
    </b-tabs>
    <hr />
    <app-order-nav
      v-if="tabIndex !== TAB_REVIEW"
      :hasNext="tabIndex < TAB_REVIEW"
      :hasPrevious="tabIndex > 0"
      @previous="onNavBackClick"
      @next="onNavNextClick"
    ></app-order-nav>
    <div
      :style="{ textAlign: 'right' }"
      v-if="tabIndex === TAB_REVIEW || entity.id"
    >
      <br />
      <button
        type="button"
        class="btn btn-success col-md-3 col-lg-2"
        :disabled="!isFormFilledOK"
        v-if="!isContextAccount || [1, 2, 3].includes(entity.status)"
        @click="crud_onSaveAction"
      >
        <i class="fas fa-check"></i> Salvar
      </button>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import { crudMixin } from '@mixins/crud-mixin';
  import { mapState, mapActions, mapGetters } from 'vuex';

  import OrderNav from './edit/OrderNav.vue';
  import OrderPerson from './edit/OrderPerson.vue';
  import OrderProducts from './edit/OrderProducts.vue';
  import OrderReview from './edit/OrderReview.vue';
  import OrderProductsNotes from './edit/OrderProductsNotes.vue';
  import OrderStatusSelect from './OrderStatusSelect.vue';
  import PersonSelect from '@resources/gl_person/PersonSelect.vue';
  import UserSelect from '@resources/gl_user/UserSelect.vue';
  import PersonContactSelect from '@resources/gl_person_contact/PersonContactSelect.vue';
  import OrderCategorySelect from '../or_order_category/OrderCategorySelect.vue';
  import { API as EntityAPI, mixin } from './order_api';

  export default {
    mixins: [crudMixin, mixin],
    components: {
      'app-order-nav': OrderNav,
      'app-order-person': OrderPerson,
      'app-order-products': OrderProducts,
      'app-order-review': OrderReview,
      'app-order-products-notes': OrderProductsNotes,
      'app-person-select': PersonSelect,
      'app-person-contact-select': PersonContactSelect,
      'app-order-status-select': OrderStatusSelect,
      'app-user-select': UserSelect,
      'app-order-category-select': OrderCategorySelect,
    },
    data() {
      return {
        entity: {
          id: null,
          type: null,
          status: this.isContextAccount ? 1 : 3, // novo ou revisao ok
          glUser: null,
          glPersonOrigin: null,
          glPersonContactOrigin: null,
          glPersonDestination: null,
          glPersonContactDestination: null,
          orderCategory: null,
          notes: '',
          internalNotes: '',
          needsReview: false,
          effectiveDate: moment().format('YYYY-MM-DD'),
          glProducts: [],
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
        appContext: 'context',
        user: 'user',
      }),
      ...mapGetters({
        isUserStaff: 'isUserStaff',
        isContextAccount: 'isContextAccount',
      }),
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
        return this.entity.glProducts.length > 0;
      },
      crud_title() {
        if (this.id) {
          return `Ordem #${this.id}`;
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
      this.updatePersonFromState();
    },
    watch: {
      personContactList(newValue, oldValue) {
        this.updatePersonFromState();
      },
    },
    methods: {
      crud_data() {
        return {
          id: this.id,
          type: this.entity.type,
          status: this.entity.status,
          notes: this.entity.notes,
          internalNotes: this.entity.internalNotes,
          needsReview: !!this.entity.needsReview,
          glPersonOriginId: this.entity.glPersonOrigin.id,
          glPersonContactOriginId: this.entity.glPersonContactOrigin.id,
          glPersonDestinationId: this.entity.glPersonDestination.id,
          glPersonContactDestinationId: this.entity.glPersonContactDestination
            .id,
          orderCategoryId: this.entity.orderCategory
            ? this.entity.orderCategory.id
            : null,
          appContext: this.appContext,
          effectiveDate: this.entity.effectiveDate
            ? this.entity.effectiveDate
            : moment().format('YYYY-MM-DD'),
          glProducts: this.entity.glProducts.map(item => {
            return {
              glProductId: item.glProductId,
              quantity: parseFloat(item.quantity),
              id: item.id,
              notes: item.notes,
            };
          }),
        };
      },
      onNavBackClick() {
        if (this.tabIndex != this.TAB_PERSONS) {
          this.tabIndex--;
        } else {
          this.crud_navBack();
        }
      },
      async onNavNextClick() {
        // persons
        if (!(await this.$refs.personComponent.validate())) {
          this.notify_warning('Preencha os campos obrigatórios.');
          if (this.tabIndex != this.TAB_PERSONS) {
            this.tabIndex = this.TAB_PERSONS;
          }
          return;
        } else {
          if (this.tabIndex == this.TAB_PERSONS) {
            this.tabIndex++;
            return;
          }
          // segue
        }
        // products
        if (this.entity.glProducts.length == 0) {
          this.notify_warning('Selecione pelo menos um produto.');
          this.tabIndex = this.TAB_PRODUCTS;
          return;
        }
        if (this.tabIndex == this.TAB_PRODUCTS) {
          this.tabIndex++;
          return;
        }
        // future
        this.tabIndex++;
      },
      onPersonInputUpdate(value) {
        setTimeout(() => {
          Object.assign(this.entity, value);
        }, 1);
      },
      onProductInputUpdate(value) {
        this.entity.glProducts = value.glProducts;
      },
      onNotesUpdate(value) {
        this.entity.notes = value;
      },
      onPersonChangeCheck() {
        if (!this.entity.glPersonOrigin) {
          this.entity.glPersonContactOrigin = null;
        }
        if (!this.entity.glPersonDestination) {
          this.entity.glPersonContactDestination = null;
        }
      },
      updatePersonFromState() {
        if (
          this.personContactList.length >= 1 &&
          !this.id &&
          this.isContextAccount
        ) {
          this.entity.glPersonOrigin = this.personContactList[0].person;
          this.entity.glPersonContactOrigin = this.personContactList[0];
          this.entity.glPersonDestination = this.personContactList[0].person;
          this.entity.glPersonContactDestination = this.personContactList[0];
          // notify child to update
          this.$refs.personComponent.updateValue(this.entity);
        }
      },
    },
  };
</script>

<style></style>
