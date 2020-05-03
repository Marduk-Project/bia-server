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
          v-model="value.data.originPerson"
          @onChange="item => fieldChange('originPerson', item)"
          required
        />
        <input
          type="hidden"
          id="input-origin-person-id"
          name="input-origin-person-id"
          v-model="value.ids.originPersonId"
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
          v-model="value.data.originPersonContact"
          :disabled="!value.ids.originPersonId"
          @onChange="item => fieldChange('originPersonContact', item)"
          required
        />
        <input
          type="hidden"
          id="input-origin-person-contact-id"
          name="input-origin-person-contact-id"
          v-model="value.ids.originPersonContactId"
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
          v-model="value.data.destinationPerson"
          @onChange="item => fieldChange('destinationPerson', item)"
          required
        />
        <input
          type="hidden"
          id="input-destination-person-id"
          name="input-destination-person-id"
          v-model="value.ids.destinationPersonId"
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
          v-model="value.data.destinationPersonContact"
          :disabled="!value.ids.destinationPersonId"
          @onChange="item => fieldChange('destinationPersonContact', item)"
          required
        />
        <input
          type="hidden"
          id="input-destination-person-contact-id"
          name="input-destination-person-contact-id"
          v-model="value.ids.destinationPersonContactId"
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
