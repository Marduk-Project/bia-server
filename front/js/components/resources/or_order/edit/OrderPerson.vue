<template>
  <form @submit.prevent novalidate>
    <div class="form-row">
      <div class="form-group col-lg-12">
        <label for="input-type">Tipo do formulário</label>
        <app-order-type-select
          :show-only="isContextAccount ? [1, 2, 3] : null"
          :show-empty="true"
          v-model="value.type"
          name="input-type"
          @input="onFieldChange"
          v-validate="'required|min:1'"
          :class="{
            'is-invalid': errors.has('input-type'),
          }"
        ></app-order-type-select>
        <div class="invalid-feedback">Campo obrigatório.</div>
      </div>
      <div class="form-group col-lg-6">
        <label for="input-glPersonDestination">
          Entidade de destino da <strong>{{ typeDesc }}</strong>
          <app-required-span></app-required-span>
        </label>
        <app-person-select
          id="input-glPersonDestination"
          name="glPersonDestination"
          :options="isContextAccount ? state_personList : null"
          v-model="value.glPersonDestination"
          @onChange="onFieldChange"
          v-validate="'required'"
          :class="{
            'is-invalid': errors.has('glPersonDestination'),
          }"
        />
        <div class="invalid-feedback">Campo obrigatório.</div>
        <small
          >Para qual entidade é destinada a <strong>{{ typeDesc }}</strong
          >.</small
        >
      </div>
      <div class="form-group col-lg-6">
        <label for="input-glPersonContactDestination">
          Contato no destino<app-required-span></app-required-span>
        </label>
        <app-person-contact-select
          id="input-glPersonContactDestination"
          name="input-glPersonContactDestination"
          v-model="value.glPersonContactDestination"
          :disabled="!value.glPersonDestination"
          @onChange="onFieldChange"
          v-validate="'required'"
          :extraparams="{
            personId: value.glPersonDestination && value.glPersonDestination.id,
          }"
          :class="{
            'is-invalid': errors.has('input-glPersonContactDestination'),
          }"
        />
        <div class="invalid-feedback">Campo obrigatório.</div>
        <small
          >Contato responsável por receber a <strong>{{ typeDesc }}</strong
          >.</small
        >
      </div>
      <div class="form-group col-lg-6">
        <label for="input-glPersonOrigin">
          Entidade responsável pela <strong>{{ typeDesc }}</strong>
          <app-required-span></app-required-span>
        </label>
        <app-person-select
          id="input-glPersonOrigin"
          name="input-glPersonOrigin"
          v-model="value.glPersonOrigin"
          :options="isContextAccount ? state_personList : null"
          @onChange="onFieldChange"
          v-validate="'required'"
          :class="{
            'is-invalid': errors.has('input-glPersonOrigin'),
          }"
        />
        <div class="invalid-feedback">Campo obrigatório.</div>
        <small
          >Entidade gestora da <strong>{{ typeDesc }}</strong> e responsável
          pela informação do formulário.</small
        >
      </div>
      <div class="form-group col-lg-6">
        <label for="input-glPersonContactOrigin">
          Contato responsável pelas informações<app-required-span
          ></app-required-span>
        </label>
        <app-person-contact-select
          id="input-glPersonContactOrigin"
          name="input-glPersonContactOrigin"
          v-model="value.glPersonContactOrigin"
          :disabled="
            !value.glPersonOrigin ||
            (isContextAccount && state_personContactOriginList.length == 1)
          "
          @onChange="onFieldChange"
          v-validate="'required'"
          :class="{
            'is-invalid': errors.has('input-glPersonContactOrigin'),
          }"
          :extraparams="{
            personId: value.glPersonOrigin
              ? value.glPersonOrigin.id
              : value.glPersonDestination
              ? value.glPersonDestination.id
              : null,
          }"
        />
        <div class="invalid-feedback">Campo obrigatório.</div>
      </div>
    </div>
  </form>
</template>

<script>
  import _ from 'lodash';
  import { mapGetters, mapState } from 'vuex';
  import OrderTypeSelect from '../OrderTypeSelect.vue';
  import PersonSelect from '@resources/gl_person/PersonSelect.vue';
  import PersonContactSelect from '@resources/gl_person_contact/PersonContactSelect.vue';

  import { mixin } from '../order_api';

  export default {
    mixins: [mixin],
    components: {
      'app-person-select': PersonSelect,
      'app-person-contact-select': PersonContactSelect,
      'app-order-type-select': OrderTypeSelect,
    },
    computed: {
      ...mapGetters(['isUserStaff', 'isContextAccount', 'isContextAdmin']),
      ...mapState({
        state_personContactList: 'personContactList',
      }),
      state_personList() {
        if (!this.state_personContactList) {
          return [];
        }
        let list = this.state_personContactList.map(item => item.person);
        list = _.uniqBy(list, 'id');
        return list;
      },
      state_personContactDestinationList() {
        if (!this.value.glPersonDestination) {
          return [];
        }
        return this.state_personContactList.filter(
          item => item.person.id == this.value.glPersonDestination.id
        );
      },
      state_personContactOriginList() {
        if (!this.value.glPersonOrigin) {
          return [];
        }
        return this.state_personContactList.filter(
          item => item.person.id == this.value.glPersonOrigin.id
        );
      },
      typeDesc() {
        if (!this.value.type) {
          return '[selecione o tipo]';
        }
        return this.typeToString(this.value.type);
      },
    },
    data() {
      return {
        value: {
          type: null,
          glPersonOrigin: null,
          glPersonContactOrigin: null,
          glPersonDestination: null,
          glPersonContactDestination: null,
        },
      };
    },
    props: {
      entity: {
        type: Object,
        required: true,
      },
    },
    watch: {
      entity(newValue, oldValue) {
        this.updateValue(newValue);
      },
    },
    methods: {
      updateValue(newValue) {
        this.value.type = newValue.type;
        this.value.glPersonOrigin = newValue.glPersonOrigin;
        this.value.glPersonContactOrigin = newValue.glPersonContactOrigin;
        this.value.glPersonDestination = newValue.glPersonDestination;
        this.value.glPersonContactDestination =
          newValue.glPersonContactDestination;
      },
      onFieldChange() {
        // destination
        if (!this.value.glPersonDestination) {
          this.value.glPersonContactDestination = null;
        } else {
          if (!this.value.glPersonOrigin) {
            this.value.glPersonOrigin = this.value.glPersonDestination;
          }
          // changed person
          if (this.value.glPersonContactDestination) {
            if (
              this.value.glPersonDestination.id !=
              this.value.glPersonContactDestination.personId
            ) {
              this.value.glPersonContactDestination = null;
            }
          }
        }
        // origin
        if (!this.value.glPersonOrigin) {
          this.value.glPersonContactOrigin = null;
        } else {
          // has person contact on state create
          if (
            this.isContextAccount &&
            this.state_personContactOriginList.length == 1
          ) {
            this.value.glPersonContactOrigin = this.state_personContactOriginList[0];
          }
          // changed person
          if (this.value.glPersonContactOrigin) {
            if (
              this.value.glPersonOrigin.id !=
              this.value.glPersonContactOrigin.personId
            ) {
              this.value.glPersonContactOrigin = null;
            }
          }
        }
        this.$emit('input', this.value);
      },
      validate() {
        return this.$validator.validate();
      },
    },
  };
</script>

<style scoped></style>
