<template>
  <b-container>
    <br />

    <b-button variant="link" @click="crud_navBack">
      <i class="fa fa-chevron-left" /> Voltar
    </b-button>

    <br />

    <h1>Demanda de EPIs</h1>

    <form @submit.prevent="nextPage" novalidate>
      <div class="form-row">
        <div class="form-group col-lg-6">
          <PersonField v-model="model.requestingPerson" />
          <label for="input-requesting-person">
            Nome da entidade solicitante
          </label>
          <app-person-select
            id="input-requesting-person"
            name="input-requesting-person"
            v-model="model.requestingPerson"
            @onChange="personObj => (model.requestingPersonId = personObj.id)"
            required
          />
          <input
            type="hidden"
            id="input-requesting-person-id"
            name="input-requesting-person-id"
            v-model="model.requestingPersonId"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('input-requesting-person-id') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>

        <div class="form-group col-lg-6">
          <label for="input-requesting-person-contact">
            Nome do(a) solicitante
          </label>
          <app-person-contact-select
            id="input-requesting-person-contact"
            v-model="model.requestingPersonContact"
            :disabled="!model.requestingPersonId"
            @onChange="
              personObj => (model.requestingPersonContactId = personObj.id)
            "
            required
          />
          <input
            type="hidden"
            id="input-requesting-person-contact-id"
            name="input-requesting-person-contact-id"
            v-model="model.requestingPersonContactId"
            v-validate="'required'"
            :class="{
              'is-invalid': errors.has('input-requesting-person-contact-id'),
            }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-lg-6">
          <label for="input-recipient-person">
            Nome da entidade destinatária
          </label>
          <app-person-select
            id="input-recipient-person"
            v-model="model.recipientPerson"
            @onChange="personObj => (model.recipientPersonId = personObj.id)"
            required
          />
          <input
            type="hidden"
            id="input-recipient-person-id"
            name="input-recipient-person-id"
            v-model="model.recipientPersonId"
            v-validate="'required'"
            :class="{
              'is-invalid': errors.has('input-requesting-person-id'),
            }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>

        <div class="form-group col-lg-6">
          <label for="input-recipient-person-contact">
            Nome do(a) destinatário(a)
          </label>
          <app-person-contact-select
            id="input-recipient-person-contact"
            v-model="model.recipientPersonContact"
            :disabled="!model.recipientPersonId"
            @onChange="
              personObj => (model.recipientPersonContactId = personObj.id)
            "
            required
          />
          <input
            type="hidden"
            id="input-recipient-person-contact-id"
            name="input-recipient-person-contact-id"
            v-model="model.requestingPersonContactId"
            v-validate="'required'"
            :class="{
              'is-invalid': errors.has('input-recipient-person-contact-id'),
            }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-lg-12">
          <label for="input-notes">
            Observações
          </label>
          <b-form-textarea
            id="input-notes"
            v-model="model.notes"
            :rows="4"
            placeholder="Descreva a situação do recebimento de materiais em sua entidade"
          />
        </div>
      </div>

      <div :style="{ textAlign: 'right' }">
        <b-button type="submit">Avançar</b-button>
      </div>
    </form>
  </b-container>
</template>

<script>
  import { crudMixin } from '@mixins/crud-mixin';

  import PersonSelect from '@resources/gl_person/PersonSelect.vue';
  import PersonContactSelect from '@resources/gl_person_contact/PersonContactSelect.vue';

  export default {
    mixins: [crudMixin],
    components: {
      'app-person-select': PersonSelect,
      'app-person-contact-select': PersonContactSelect,
    },
    data() {
      return {
        model: {
          requestingPerson: {},
          requestingPersonId: null,
          requestingPersonContact: {},
          requestingPersonContactId: null,
          recipientPerson: {},
          recipientPersonId: null,
          recipientPersonContact: {},
          recipientPersonContactId: null,
          notes: '',
        },
      };
    },
    methods: {
      setFieldValueId(evt, value) {
        console.log(evt, value);
      },
      nextPage() {
        this.$validator.validate().then(isFormValid => {
          if (isFormValid) {
            this.$router.push({
              name: 'or_request.create.ppe',
              params: {
                recipientPersonId: this.model.recipientPerson.id,
                recipientPersonContactId: this.model.recipientPersonContact.id,
                requestingPersonId: this.model.requestingPerson.id,
                requestingPersonContactId: this.model.requestingPersonContact
                  .id,
                notes: this.model.notes,
              },
            });
          }
        });
      },
    },
  };
</script>

<style></style>
