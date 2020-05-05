<template>
  <form @submit.prevent novalidate>
    <div class="form-row">
      <div class="form-group col-lg-6">
        <label for="input-glPersonDestination">
          Entidade de destino <app-required-span></app-required-span>
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
        <small>Para qual entidade é destinada a solicitação ou entrega.</small>
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
        <small>Contato responsável por receber ou enviar os itens.</small>
      </div>
      <div class="form-group col-lg-6">
        <label for="input-glPersonOrigin">
          Entidade solicitante, doadora ou gestora da demanda
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
          >Entidade responsavel por realizar/gerir as solicitações e
          doações.</small
        >
      </div>
      <div class="form-group col-lg-6">
        <label for="input-glPersonContactOrigin">
          Responsável pelas informações<app-required-span></app-required-span>
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
          :options="isContextAccount ? state_personContactOriginList : null"
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
  import PersonSelect from '@resources/gl_person/PersonSelect.vue';
  import PersonContactSelect from '@resources/gl_person_contact/PersonContactSelect.vue';

  export default {
    components: {
      'app-person-select': PersonSelect,
      'app-person-contact-select': PersonContactSelect,
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
    },
    data() {
      return {
        value: {
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
          // has person on state
          if (
            this.isContextAccount &&
            this.state_personContactDestinationList.length == 1
          ) {
            this.value.glPersonContactDestination = this.state_personContactDestinationList[0];
          }
          // changed person
          if (this.value.glPersonContactDestination) {
            if (
              this.value.glPersonDestination.id !=
              this.value.glPersonContactDestination.person.id
            ) {
              this.value.glPersonContactDestination = null;
            }
          }
        }
        // origin
        if (!this.value.glPersonOrigin) {
          this.value.glPersonContactOrigin = null;
        } else {
          // has person contact on state
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
              this.value.glPersonContactOrigin.person.id
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
    mounted() {},
  };
</script>

<style scoped></style>
