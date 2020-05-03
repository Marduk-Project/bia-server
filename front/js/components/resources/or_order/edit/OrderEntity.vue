<template>
  <form @submit.prevent="validateAndSubmit" novalidate>
    <div class="form-row">
      <div class="form-group col-lg-6">
        <label for="input-origin-person">
          Nome da entidade solicitante
        </label>
        <app-person-select
          id="input-origin-person"
          name="input-origin-person"
          v-model="value.data.glPersonOrigin"
          @onChange="item => fieldChange('glPersonOrigin', item)"
          required
        />
        <input
          type="hidden"
          id="input-origin-person-id"
          name="input-origin-person-id"
          v-model="value.ids.glPersonOriginId"
          v-validate="'required'"
          :class="{ 'is-invalid': errors.has('input-origin-person-id') }"
        />
        <div class="invalid-feedback">Campo obrigatório.</div>
      </div>

      <div class="form-group col-lg-6">
        <label for="input-origin-person-contact">
          Nome do(a) solicitante
        </label>
        <app-person-contact-select
          id="input-origin-person-contact"
          v-model="value.data.glPersonContactOrigin"
          :disabled="!value.ids.glPersonOriginId"
          @onChange="item => fieldChange('glPersonContactOrigin', item)"
          required
        />
        <input
          type="hidden"
          id="input-origin-person-contact-id"
          name="input-origin-person-contact-id"
          v-model="value.ids.glPersonContactOriginId"
          v-validate="'required'"
          :class="{
            'is-invalid': errors.has('input-origin-person-contact-id'),
          }"
        />
        <div class="invalid-feedback">Campo obrigatório.</div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group col-lg-6">
        <label for="input-destination-person">
          Nome da entidade destinatária
        </label>
        <app-person-select
          id="input-destination-person"
          v-model="value.data.glPersonDestination"
          @onChange="item => fieldChange('glPersonDestination', item)"
          required
        />
        <input
          type="hidden"
          id="input-destination-person-id"
          name="input-destination-person-id"
          v-model="value.ids.glPersonDestinationId"
          v-validate="'required'"
          :class="{
            'is-invalid': errors.has('input-origin-person-id'),
          }"
        />
        <div class="invalid-feedback">Campo obrigatório.</div>
      </div>

      <div class="form-group col-lg-6">
        <label for="input-destination-person-contact">
          Nome do(a) destinatário(a)
        </label>
        <app-person-contact-select
          id="input-destination-person-contact"
          v-model="value.data.glPersonContactDestination"
          :disabled="!value.ids.glPersonDestinationId"
          @onChange="item => fieldChange('glPersonContactDestination', item)"
          required
        />
        <input
          type="hidden"
          id="input-destination-person-contact-id"
          name="input-destination-person-contact-id"
          v-model="value.ids.glPersonContactDestinationId"
          v-validate="'required'"
          :class="{
            'is-invalid': errors.has('input-destination-person-contact-id'),
          }"
        />
        <div class="invalid-feedback">Campo obrigatório.</div>
      </div>
    </div>
  </form>
</template>

<script>
  import PersonSelect from '@resources/gl_person/PersonSelect.vue';
  import PersonContactSelect from '@resources/gl_person_contact/PersonContactSelect.vue';

  export default {
    components: {
      'app-person-select': PersonSelect,
      'app-person-contact-select': PersonContactSelect,
    },
    props: {
      value: {
        type: Object,
        default: () => ({
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
          notes: '',
        }),
      },
    },
    methods: {
      fieldChange(setIdTo, personObj) {
        if (setIdTo) {
          this.value.ids[`${setIdTo}Id`] = personObj.id;
        }
        this.$emit('input', this.value);
      },
      validateAndSubmit() {
        this.$validator.validate().then(isFormValid => {
          if (isFormValid) {
            this.$emit('submit', this.value);
          }
        });
      },
    },
  };
</script>
