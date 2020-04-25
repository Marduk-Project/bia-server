<template>
  <b-container>
    <br />
    <b-button variant="link" @click="crud_navBack">
      <i class="fa fa-chevron-left"/> Voltar
    </b-button>
    <br />
    <h1>{{ crud_title }}</h1>
    <b-form>
      <b-form-group
        id="group-applicant"
        label="Nome do(a) solicitante"
        label-for="input-applicant"
      >
        <b-form-input
          id="input-applicant"
          v-model="model.applicant"
          type="text"
          required
          placeholder="Digite o nome completo sem abreviações"
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
            />
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group
            id="group-email"
            label="E-mail"
            label-for="input-email"
          >
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
          <b-form-group
            id="group-city"
            label="Cidade"
            label-for="input-city"
          >
            <b-form-input
              id="input-city"
              v-model="model.city"
              type="text"
              required
              placeholder="Digite ou selecione"
            />
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group
            id="group-state"
            label="Estado"
            label-for="input-state"
          >
            <b-form-input
              id="input-state"
              v-model="model.state"
              type="text"
              required
              placeholder="Digite ou selecione"
            />
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
        <b-button>Avançar</b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script>
import { crudMixin } from "../../../libs/mixins/crud-mixin";

export default {
  mixins: [crudMixin],
  data () {
    return {
      model: {
        applicant: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        entity: "",
        notes: ""
      }
    }
  }
}
</script>

<style>

</style>