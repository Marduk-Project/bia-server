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
        :to="{
          name: 'gl_person_contact.index',
          params: {
            parentEntityId: entity.id,
            parentEntity: entity,
            origin: 'p',
          },
        }"
      >
        <i class="fa fa-id-card"></i> Contatos &amp; Usuários
      </router-link>
      <br />
      <br />
    </div>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-lg-3">
          <label>Tipo legal</label>
          <app-legal-type-select
            v-model="entity.legalType"
          ></app-legal-type-select>
        </div>
        <div class="form-group col-lg-3">
          <label>{{ legalIdentifierTypeDesc }}</label>
          <input
            name="legalIdentifierCode"
            class="form-control"
            type="text"
            v-model="entity.legalIdentifierCode"
            :placeholder="
              legalIdentifierType == 'CPF'
                ? 'ex. 123456789'
                : legalIdentifierType == 'CNPJ'
                ? 'ex. 12345678901234'
                : '(opcional)'
            "
            v-mask="[
              legalIdentifierType == 'CPF'
                ? '###.###.###-##'
                : legalIdentifierType == 'CNPJ'
                ? '##.###.###/####-##'
                : null,
            ]"
            v-validate="legalIdentifierValidateRule"
            :class="{ 'is-invalid': errors.has('legalIdentifierCode') }"
          />
          <small>
            Digite apenas os números se for
            <strong>CPF</strong> ou <strong>CNPJ</strong>.
            <strong>Pessoa Física</strong> é necessário um CPF válido. Se for
            uma <strong>Pessoa Jurídica</strong>, é necessário um CNPJ. Caso
            contrário você pode registrar um identificador livre.
          </small>
          <div class="invalid-feedback">
            Campo obrigatório. Digite um {{ legalIdentifierTypeDesc }} válido.
          </div>
        </div>
        <div class="form-group col-lg-3">
          <label>Tipo entidade</label>
          <app-person-type-select
            v-model="entity.personType"
          ></app-person-type-select>
        </div>
        <div class="form-group col-lg-3">
          <label>Entidade pai</label>
          <app-person-select v-model="entity.personParent"></app-person-select>
          <small
            >Registro superior (ex. Prefeitura é pai de Secretaria, gestores ou
            semelhante).</small
          >
        </div>
        <div class="form-group col-lg-6">
          <label>{{
            entity.legalIdentifierType == 'CNPJ'
              ? 'Razão social'
              : 'Nome completo'
          }}</label>
          <input
            class="form-control"
            name="name"
            type="text"
            v-model="entity.name"
            placeholder="ex. Fulano Ciclano Tal"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('name') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-6">
          <label>{{
            entity.legalIdentifierType == 'CPF'
              ? 'Nome resumido ou apelido'
              : 'Nome fantasia'
          }}</label>
          <input
            class="form-control"
            name="shortname"
            type="text"
            v-model="entity.shortname"
            placeholder="ex. Fulano"
          />
        </div>
        <div class="form-group col-lg-3">
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
        <div class="form-group col-lg-3">
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
        <div class="form-group col-lg-3">
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
        <div class="form-group col-lg-3">
          <label>Prioridade (Grau COVID)</label>
          <input
            name="priority"
            type="number"
            step="1"
            class="form-control"
            v-model="entity.priority"
          />
        </div>
      </div>
      <br />
      <h4>Endereço</h4>
      <div class="form-row">
        <div class="form-group col-lg-3">
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
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="onGetZipcodeClick"
              >
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="form-group col-lg-6">
          <label>Logradouro (Rua)</label>
          <input
            class="form-control"
            type="text"
            v-model="entity.address"
            placeholder="ex. Rua dos amigos"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>Número</label>
          <input
            class="form-control"
            type="text"
            v-model="entity.addressNumber"
            placeholder="ex. 5"
            ref="fd_numero"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>Complemento</label>
          <input
            class="form-control"
            type="text"
            v-model="entity.addressExtra"
            placeholder="ex. sala 1001"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>Bairro</label>
          <input
            class="form-control"
            type="text"
            v-model="entity.addressNeighborhood"
            placeholder="ex. Centro"
          />
        </div>
        <div class="form-group col-lg-3">
          <label>Cidade</label>
          <app-city-select v-model="entity.city"></app-city-select>
          <small class="text-danger" v-if="!entity.city"
            >Campo obrigatório.</small
          >
        </div>
        <div class="form-group col-lg-3">
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
          <textarea
            rows="4"
            v-model="entity.obs"
            class="form-control"
          ></textarea>
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
          <div class="form-check">
            <label
              class="form-check-label"
              v-b-tooltip.hover
              title="Entidade será ignorada na exportação de dados."
            >
              <input
                class="form-check-input"
                type="checkbox"
                value="1"
                v-model="entity.exportIgnore"
              />
              Ignorar na exportação de dados.
            </label>
          </div>
        </div>
      </div>
      <div v-if="entity.id">
        <br />
        <br />
        <h4>Campos adicionais</h4>
        <table
          class="table table-hover table-struped"
          v-if="fieldList.length > 0"
        >
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <app-field-row
              v-for="field in fieldList"
              :key="field.id"
              :field="field"
              @input="onFieldInput"
            ></app-field-row>
          </tbody>
        </table>
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
  import { crudMixin } from '@mixins/crud-mixin';
  import axios from '@mixins/axios-auth';
  import _axios from 'axios';
  import PersonLegalTypeSelect from '@resources/gl_person/PersonLegalTypeSelect.vue';
  import CitySelect from '@resources/gl_city/CitySelect.vue';
  import PersonFieldTableRow from '@resources/gl_person_field/PersonFieldTableRow.vue';
  import PersonTypeSelect from '../gl_person_type/PersonTypeSelect.vue';
  import PersonSelect from './PersonSelect.vue';

  export default {
    mixins: [crudMixin],
    components: {
      'app-legal-type-select': PersonLegalTypeSelect,
      'app-person-type-select': PersonTypeSelect,
      'app-person-select': PersonSelect,
      'app-city-select': CitySelect,
      'app-field-row': PersonFieldTableRow,
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
          exportIgnore: false,
          latitude: 0,
          longitude: 0,
          obs: null,
          priority: 0,
          // obs
          city: null,
          personParent: null,
          personType: null,
        },
        fieldList: [],
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
          legalIdentifierCode:
            this.legalIdentifierType == 'CPF'
              ? this.entity.legalIdentifierCode.replace(/[^0-9]/g, '')
              : this.legalIdentifierType == 'CNPJ'
              ? this.entity.legalIdentifierCode.replace(/[^0-9]/g, '')
              : this.entity.legalIdentifierCode,
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
          obs: this.entity.obs,
          priority: this.entity.priority,
          personTypeId: this.entity.personType
            ? this.entity.personType.id
            : null,
          personParentId: this.entity.personParent
            ? this.entity.personParent.id
            : null,
          exportIgnore: !!this.entity.exportIgnore,
          fields: this.fieldList.map(field => {
            let value = null;
            switch (parseInt(field.field.type)) {
              case 1:
                value = field.valueString;
                break;

              case 2:
                value = field.valueInt;
                break;

              case 3:
                value = field.valueDouble;
                break;

              case 4:
                value = field.valueBoolean;
                break;

              case 5:
                value = field.fieldItemId;
                break;
            }
            return {
              id: field.id,
              fieldItemId: field.fieldItemId,
              value: value,
            };
          }),
        };
      },
      crud_validate() {
        if (!this.entity.city) {
          this.notify_warning('Selecione uma cidade.');
          return false;
        }
        return true;
      },
      crud_requestEntityParseResponse(res) {
        if (res.data.fieldList) {
          this.fieldList = res.data.fieldList;
        }
        this.wsRequested = true;
        if (res.data.entity) {
          return res.data.entity;
        }
        if (res.data.data) {
          return res.data.data;
        }
        return null;
      },
      onGetZipcodeBlur() {
        if (
          !this.entity.addressZipcode ||
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
          this.notify_warning('Preencha um CEP válido.');
          return;
        }
        if (
          this.entity.addressZipcode.length < 8 ||
          this.entity.addressZipcode.length > 9
        ) {
          this.notify_warning('Preencha um CEP válido.');
          return;
        }
        this.getDataForZipcode();
      },
      getDataForZipcode() {
        const zipCodeOnlyNumbers = this.entity.addressZipcode.replace('-', '');
        const externalAxios = _axios.create();
        externalAxios.defaults.headers.common = {};
        externalAxios.defaults.headers.common.accept = 'application/json';
        this.api_loadingShow();
        externalAxios
          .get(`//viacep.com.br/ws/${zipCodeOnlyNumbers}/json/`)
          .then(
            this.api_thenDone(res => {
              // the api won't return these fields
              // in case the zip code doesn't exist.
              this.entity.address = res.data.logradouro || '';
              this.entity.addressNeighborhood = res.data.bairro || '';
              this.entity.addressNumber = '';
              axios.get(`/api/admin/gl_city?code=${res.data.ibge}`).then(
                this.api_thenDone(res => {
                  const cityObj = res.data && res.data.data && res.data.data[0];
                  if (cityObj) {
                    this.entity.city = cityObj;
                  }
                }, true)
              );
            }, true)
          )
          .catch(this.api_catch());
      },
      onFieldInput(value) {
        this.fieldList.forEach(item => {
          if (item.id == value.id) {
            Object.assign(item, value);
          }
        });
      },
      crud_shouldNavBackAfterSave() {
        return false;
      },
    },
    computed: {
      legalIdentifierType() {
        switch (parseInt(this.entity.legalType)) {
          case 1:
            return 'CPF';

          case 2:
          case 3:
            return 'CNPJ';

          case 4:
          case 5:
          case 6:
            return 'OTHER';
        }
        return 'Desconhecido';
      },
      legalIdentifierTypeDesc() {
        switch (parseInt(this.entity.legalType)) {
          case 1:
            return 'CPF';

          case 2:
          case 3:
            return 'CNPJ';

          case 4:
          case 5:
          case 6:
            return 'Outro identificador';
        }
        return 'Desconhecido';
      },
      legalIdentifierValidateRule() {
        switch (parseInt(this.entity.legalType)) {
          case 1:
            return 'cpf|required';

          case 2:
          case 3:
            return 'cnpj|required';

          case 4:
          case 5:
          case 6:
            return '';
        }
        return '';
      },
      crud_title() {
        var ok = this.entity != null;
        if (ok) {
          ok = this.entity.name != null;
        }
        if (ok) {
          return '' + this.entity.name;
        } else {
          return 'Cadastro de Pessoa';
        }
      },
      crud_url_base() {
        return '/api/admin/gl_person';
      },
      crud_route_base() {
        return 'gl_person';
      },
    },
  };
</script>

<style scoped></style>
