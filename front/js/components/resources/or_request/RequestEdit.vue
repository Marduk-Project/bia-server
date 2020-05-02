<template>
  <b-container>
    <br />

    <b-button variant="link" @click="crud_navBack">
      <i class="fa fa-chevron-left" /> Voltar
    </b-button>

    <br />

    <h1>Demanda de EPIs</h1>

    <form @submit.prevent="nextPage">
      <div class="form-row">
        <div class="form-group col-lg-6">
          <label for="input-requesting-person">
            Nome da entidade solicitante
          </label>
          <app-person-select
            id="input-requesting-person"
            v-model="model.requestingPerson"
            required
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="input-requesting-person-contact">
            Nome do(a) solicitante
          </label>
          <app-person-contact-select
            id="input-requesting-person-contact"
            v-model="model.requestingPersonContact"
            :disabled="model.requestingPerson.length === 0"
            required
          />
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
            required
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="input-recipient-person-contact">
            Nome do(a) destinatário(a)
          </label>
          <app-person-contact-select
            id="input-recipient-person-contact"
            v-model="model.recipientPersonContact"
            :disabled="model.recipientPerson.length === 0"
            required
          />
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
          requestingPersonContact: {},
          recipientPerson: {},
          recipientPersonContact: {},
          notes: '',
        },
      };
    },
    methods: {
      nextPage() {
        this.$router.push({
          name: 'or_request.create.ppe',
          params: {
            recipientPersonId: this.model.recipientPerson.id,
            recipientPersonContactId: this.model.recipientPersonContact.id,
            requestingPersonId: this.model.requestingPerson.id,
            requestingPersonContactId: this.model.requestingPersonContact.id,
            notes: this.model.notes,
          },
        });
      },
    },
  };
</script>

<style></style>
