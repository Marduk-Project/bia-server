<template>
  <div v-if="entity">
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
    </div>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-xl-6">
          <label>Tipo pessoa</label>
          <app-person-type-select v-model="entity.legalType"></app-person-type-select>
        </div>
        <div class="form-group col-xl-6">
          <label>CPF/CNPJ/Outro</label>
          <input
            name="legalIdentifierCode"
            class="form-control"
            type="text"
            v-model="entity.legalIdentifierCode"
            placeholder="ex. 123456789"
            v-validate="entity.legalType == 1 ? 'cpf|required' : (entity.legalType == 2 ? 'cnpj|required' : '')"
            :class="{ 'is-invalid':errors.has('legalIdentifierCode') }"
          />
          <div
            class="invalid-feedback"
          >Campo obrigatório. {{ entity.legalType == 1 || entity.legalType == 2 ? 'Digite um CPF ou CNPJ válido.' : '' }}</div>
        </div>
        <div class="form-group col-xl-6">
          <label>{{ entity.legalType == 1 ? 'Nome completo' : 'Razão social' }}</label>
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
          <label>{{ entity.tipo_pessoa == 1 ? 'Apelido' : 'Nome fantasia' }}</label>
          <input
            class="form-control"
            name="shortname"
            type="text"
            v-model="entity.shortname"
            placeholder="ex. Fulano"
            v-validate="'required'"
            :class="{ 'is-invalid':errors.has('shortname') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
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
              placeholder="ex. 93500-320"
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
            placeholder="ex. Rua Mostardeiros"
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
          <app-cidade-select v-model="entity.cidade"></app-cidade-select>
        </div>
        <div class="form-group col-xl-3">
          <label>Data nascimento</label>
          <input
            class="form-control"
            type="date"
            v-model="entity.data_nascimento"
            placeholder="data"
          />
        </div>
      </div>
      <br />
      <h4>Informações tributárias</h4>
      <br />
      <br />
      <h4>Regras</h4>
      <div class="form-row">
        <div class="form-group col-12">
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                v-model="entity.cadastro_completo"
              />
              Cadastro completo
              <small
                class="text-muted"
              >(o cadastro foi concluído pelo cliente).</small>
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                v-model="entity.prestador_servico"
              />
              Prestador de serviços
              <small class="text-muted">(filtros para o sistema).</small>
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

export default {
  mixins: [crudMixin],
  components: {
    "app-person-type-select": PersonTypeSelect
  },
  data() {
    return {
      entity: {
        id: null,
        name: null,
        shortname: null,
        legalType: 2,
        legalIdentifierCode: "",
        address: null,
        addressZipcode: null,
        addressNumber: null,
        addressExtra: null,
        addressNeighborhood: null,
        addressCity: null,
        addressState: null,
        email: null,
        cellphone: null,
        phone: null,
        trusted: false,
        latitude: null,
        longitude: null
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
        legalIdentifierCode: this.entity.legalIdentifierCode,
        address: this.entity.address,
        addressZipcode: this.entity.addressZipcode,
        addressNumber: this.entity.addressNumber,
        addressExtra: this.entity.addressExtra,
        addressNeighborhood: this.entity.addressNeighborhood,
        addressCity: this.entity.addressCity,
        addressState: this.entity.addressState,
        email: this.entity.email,
        cellphone: this.entity.cellphone,
        phone: this.entity.phone,
        trusted: this.entity.trusted ? true : false,
        latitude: this.entity.latitude,
        longitude: this.entity.longitude
      };
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
      this.onGetZipcodeClick();
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
