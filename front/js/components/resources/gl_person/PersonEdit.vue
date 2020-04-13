<template>
  <div v-if="entity" class="container-fluid">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <br />
    <h1>{{ crud_title }}</h1>
    <div v-if="entity.id != null">
      <router-link
        class="btn btn-outline-secondary"
        tag="button"
        :to="{ name: 'gl_person_contact.index', params: { parentEntityId: entity.id, parentEntity: entity, origin: 'p' } }"
      >
        <i class="fa fa-user"></i> Contatos &amp; Usuários
      </router-link>
      <br />
      <br />
    </div>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-xl-6">
          <label>Tipo pessoa</label>
          <app-person-type-select v-model="entity.legalType"></app-person-type-select>
        </div>
        <div class="form-group col-xl-6">
          <label>{{ legalIdentifierTypeDesc }}</label>
          <input
            name="legalIdentifierCode"
            class="form-control"
            type="text"
            v-model="entity.legalIdentifierCode"
            :placeholder="entity.legalType == 1 ? 'ex. 123456789' : (entity.legalType == 2 ? 'ex. 12345678901234' : '(opcional)')"
            v-validate="legalIdentifierValidateRule"
            :class="{ 'is-invalid':errors.has('legalIdentifierCode') }"
          />
          <small>
            Digite apenas os números se for
            <strong>CPF</strong> ou
            <strong>CNPJ</strong>.
            <strong>Pessoa Física</strong> é necessário um CPF válido. Se for uma
            <strong>Pessoa Jurídica</strong>, é necessário um CNPJ. Caso contrário você pode registrar um identificador livre.
          </small>
          <div
            class="invalid-feedback"
          >Campo obrigatório. Digite um {{ legalIdentifierTypeDesc }} válido.</div>
        </div>
        <div class="form-group col-xl-6">
          <label>{{ entity.legalType == 2 ? 'Razão social' : 'Nome completo' }}</label>
          <input
            class="form-control"
            name="name"
            type="text"
            v-model="entity.name"
            placeholder="ex. Fulano Ciclano Tal"
            v-validate="'required'"
            :class="{ 'is-invalid':errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-xl-6">
          <label>{{ entity.legalType == 1 ? 'Apelido' : 'Nome fantasia' }}</label>
          <input
            class="form-control"
            name="shortname"
            type="text"
            v-model="entity.shortname"
            placeholder="ex. Fulano"
          />
        </div>
        <div class="form-group col-xl-4">
          <label>Telefone fixo</label>
          <input
            name="phone"
            type="text"
            v-mask="['(##) ####-####', '(##) #####-####', '(###) #####-####']"
            class="form-control"
            v-model="entity.phone"
            placeholder="ex. (51) 1234-5678"
          />
        </div>
        <div class="form-group col-xl-4">
          <label>Telefone celular</label>
          <input
            type="text"
            name="cellphone"
            v-mask="['(##) ####-####', '(##) #####-####', '(###) #####-####']"
            class="form-control"
            v-model="entity.cellphone"
            placeholder="ex. (51) 12345-6789"
          />
        </div>
        <div class="form-group col-xl-4">
          <label>E-mail</label>
          <input
            name="email"
            type="email"
            class="form-control"
            v-model="entity.email"
            placeholder="ex. contato@exemplo.com.br"
            v-validate="'email'"
            :class="{ 'is-invalid': errors.has('email') }"
          />
          <div class="invalid-feedback">Campo deve ser um e-mail.</div>
        </div>
      </div>
      <br />
      <h4>Endereço</h4>
      <div class="form-row">
        <div class="form-group col-xl-3">
          <label>CEP</label>
          <div class="input-group">
            <input
              name="cep"
              class="form-control"
              type="text"
              v-mask="['#####-###']"
              v-model="entity.addressZipcode"
              placeholder="ex. 90000-300"
              @blur="onGetZipcodeBlur"
            />
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="onGetZipcodeClick">
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
          <small>Apenas os números.</small>
        </div>
        <div class="form-group col-xl-6">
          <label>Logradouro (Rua)</label>
          <input
            class="form-control"
            type="text"
            v-model="entity.address"
            placeholder="ex. Rua dos amigos"
          />
        </div>
        <div class="form-group col-xl-3">
          <label>Número</label>
          <input
            class="form-control"
            type="text"
            v-model="entity.addressNumber"
            placeholder="ex. 5"
            ref="fd_numero"
          />
        </div>
        <div class="form-group col-xl-3">
          <label>Complemento</label>
          <input
            class="form-control"
            type="text"
            v-model="entity.addressExtra"
            placeholder="ex. sala 1001"
          />
        </div>
        <div class="form-group col-xl-3">
          <label>Bairro</label>
          <input
            class="form-control"
            type="text"
            v-model="entity.addressNeighborhood"
            placeholder="ex. Centro"
          />
        </div>
        <div class="form-group col-xl-3">
          <label>Cidade</label>
          <app-city-select v-model="entity.city"></app-city-select>
          <small class="text-danger" v-if="!entity.city">Campo obrigatório.</small>
        </div>
        <div class="form-group col-xl-3">
          <label>Data nascimento</label>
          <app-input-date
            class="form-control"
            type="date"
            v-model="entity.birthdate"
            placeholder="data"
          />
        </div>
        <div class="form-group col-12">
          <label>Observações</label>
          <textarea rows="4" v-model="entity.obs" class="form-control"></textarea>
        </div>
      </div>
      <br />
      <br />
      <h4>Regras</h4>
      <div class="form-row">
        <div class="form-group col-12">
          <div class="form-check">
            <label
              class="form-check-label"
              :class="{ 'text-success': entity.trusted }"
              v-b-tooltip.hover
              title="Foi validado por algum outro usuário confiável. Você não pode alterar esta informação aqui."
            >
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                disabled
                v-model="entity.trusted"
              />
              Possui identidade verificada.
            </label>
          </div>
        </div>
      </div>
      <br />
      <div class="form-row">
        <app-crud-buttons
          @onSave="crud_onSaveAction"
          @onDelete="crud_onDeleteAction"
          :delete-show="entity.id != null"
        ></app-crud-buttons>
      </div>
      <app-entitybaseinfo :entity="entity"></app-entitybaseinfo>
    </form>
  </div>
</template>

<script>
import { crudMixin } from "../../../libs/mixins/crud-mixin";
import axios from "../../../libs/mixins/axios-auth";
import PersonTypeSelect from "./PersonTypeSelect.vue";
import CitySelect from "../gl_city/CitySelect.vue";

export default {
  mixins: [crudMixin],
  components: {
    "app-person-type-select": PersonTypeSelect,
    "app-city-select": CitySelect
  },
  data() {
    return {
      entity: {
        id: null,
        name: null,
        shortname: null,
        legalType: 2,
        legalIdentifierType: null,
        legalIdentifierCode: null,
        address: null,
        addressZipcode: null,
        addressNumber: null,
        addressExtra: null,
        addressNeighborhood: null,
        cityId: null,
        email: null,
        cellphone: null,
        phone: null,
        birthdate: null,
        trusted: false,
        latitude: 0,
        longitude: 0,
        obs: null,
        // obs
        city: null
      }
    };
  },
  methods: {
    crud_data() {
      return {
        id: this.entity.id,
        name: this.entity.name,
        shortname: this.entity.shortname,
        legalType: this.entity.legalType,
        legalIdentifierType: this.legalIdentifierType, // computed
        legalIdentifierCode: this.entity.legalIdentifierCode,
        address: this.entity.address,
        addressZipcode: this.entity.addressZipcode,
        addressNumber: this.entity.addressNumber,
        addressExtra: this.entity.addressExtra,
        addressNeighborhood: this.entity.addressNeighborhood,
        cityId: this.entity.city ? this.entity.city.id : null,
        email: this.entity.email,
        cellphone: this.entity.cellphone,
        phone: this.entity.phone,
        birthdate: this.entity.birthdate,
        trusted: this.entity.trusted ? true : false,
        latitude: this.entity.latitude,
        longitude: this.entity.longitude,
        obs: this.entity.obs
      };
    },
    crud_validate() {
      if (!this.entity.city) {
        this.notify_warning("Selecione uma cidade");
        return false;
      }
      return true;
    },
    crud_shouldNavBackAfterSave() {
      return false;
    },
    onGetZipcodeBlur() {
      if (!this.entity.addressZipcode) {
        return;
      }
      if (
        this.entity.addressZipcode.length < 8 ||
        this.entity.addressZipcode.length > 9
      ) {
        return;
      }
      if (this.entity.address) {
        return;
      }
      // this.onGetZipcodeClick(); // TODO descomentar quando implementar busca de cep
    },
    onGetZipcodeClick() {
      if (!this.entity.addressZipcode) {
        this.notify_warning("Preencha um CEP válido.");
        return;
      }
      if (
        this.entity.addressZipcode.length < 8 ||
        this.entity.addressZipcode.length > 9
      ) {
        this.notify_warning("Preencha um CEP válido.");
        return;
      }
      this.notify_warning("Busca de CEP ainda não implementada");
      return;
      // TODO zipcode
      /*
      this.api_loadingShow();
      axios
        .post("/api/geo/cep", { cep: this.entity.end_cep })
        .then(
          this.api_thenDone(res => {
            this.entity.address = res.data.data.logradouro;
            this.entity.addressNeighborhood = res.data.data.bairro;
            this.entity.addressNumber = "";
          }, true)
        )
        .catch(this.api_catch());
        */
    }
  },
  computed: {
    legalIdentifierType() {
      switch (parseInt(this.entity.legalType)) {
        case 1:
          return "CPF";

        case 2:
          return "CNPJ";

        case 3:
          return "OTHER";
      }
      return "Desconhecido";
    },
    legalIdentifierTypeDesc() {
      switch (parseInt(this.entity.legalType)) {
        case 1:
          return "CPF";

        case 2:
          return "CNPJ";

        case 3:
          return "Outro identificador";
      }
      return "Desconhecido";
    },
    legalIdentifierValidateRule() {
      switch (parseInt(this.entity.legalType)) {
        case 1:
          return "cpf-num|required";

        case 2:
          return "cnpj-num|required";

        case 3:
          return "";
      }
      return "";
    },
    legalIdentifierIsRequired() {
      switch (parseInt(this.entity.legalType)) {
        case 1:
        case 2:
          return true;

        case 3:
          return false;
      }
      return false;
    },
    crud_title() {
      var ok = this.entity != null;
      if (ok) {
        ok = this.entity.name != null;
      }
      if (ok) {
        return "" + this.entity.name;
      } else {
        return "Cadastro de Pessoa";
      }
    },
    crud_url_base() {
      return "/api/admin/gl_person";
    },
    crud_route_base() {
      return "gl_person";
    }
  }
};
</script>

<style scoped>
</style>
