<template>
  <b-container>
    <br />
    <b-button variant="link" @click="crud_navBack">
      <i class="fa fa-chevron-left" /> Voltar
    </b-button>
    <br />
    <h1>Demanda de EPIs</h1>
    <b-form>
      <b-form-group
        id="group-applicant"
        label="Nome do(a) solicitante"
        label-for="input-applicant"
      >
        <app-person-select
          id="input-applicant"
          v-model="model.person"
          @onChange="fetchPersonData"
        />
      </b-form-group>

      <b-row>
        <b-col>
          <b-form-group
            id="group-phone"
            label="Telefone celular (com DDD)"
            label-for="input-phone"
          >
            <b-form-input
              id="input-phone"
              v-model="model.phone"
              type="text"
              required
              placeholder="(00)00000-0000"
              v-mask="['(##) ####-####', '(##) #####-####', '(###) #####-####']"
            />
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group id="group-email" label="E-mail" label-for="input-email">
            <b-form-input
              id="input-email"
              v-model="model.email"
              type="text"
              required
              placeholder="seuemail@provedor.com.br"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <hr />

      <b-row>
        <b-col>
          <b-form-group id="group-state" label="Estado" label-for="input-state">
            <app-state-select id="input-state" v-model="model.state" />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group id="group-city" label="Cidade" label-for="input-city">
            <app-city-select
              id="input-city"
              v-model="model.city"
            ></app-city-select>
          </b-form-group>
        </b-col>
      </b-row>

      <b-form-group
        id="group-entity"
        label="Entidade destinatária"
        label-for="input-entity"
      >
        <b-form-input
          id="input-entity"
          v-model="model.entity"
          type="text"
          required
          placeholder="Digite ou selecione a entidade"
        />
      </b-form-group>

      <b-form-group
        id="group-notes"
        label="Observações"
        label-for="input-notes"
      >
        <b-form-textarea
          id="input-notes"
          v-model="model.notes"
          type="text"
          required
          placeholder="Descreva a situação do recebimento de materiais em sua entidade"
        />
      </b-form-group>

      <div :style="{ textAlign: 'right' }">
        <b-button @click="nextPage">Avançar</b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script>
  import { crudMixin } from '@mixins/crud-mixin';
  import PersonSelect from '@resources/gl_person/PersonSelect.vue';
  import CitySelect from '@resources/gl_city/CitySelect.vue';
  import StateSelect from '@resources/gl_state/StateSelect.vue';

  export default {
    mixins: [crudMixin],
    components: {
      'app-person-select': PersonSelect,
      'app-city-select': CitySelect,
      'app-state-select': StateSelect,
    },
    data() {
      return {
        model: {
          applicant: '',
          phone: '',
          email: '',
          city: '',
          state: '',
          entity: '',
          notes: '',
        },
      };
    },
    methods: {
      fetchPersonData(personData) {
        console.log('test');
        this.model.applicant = '';
        this.model.phone = personData.cellphone || personData.phone;
        this.model.email = personData.email;
        this.model.city = personData.city.name;
        this.model.state = personData.stateId;
        this.model.entity = personData.entity;
      },
      nextPage() {
        this.$router.push({
          name: 'or_request.create.ppe',
        });
      },
    },
  };
</script>

<style></style>
