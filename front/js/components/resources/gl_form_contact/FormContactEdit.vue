<template>
  <div v-if="entity" class="container-fluid">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <br />
    <h1>{{ crud_title }}</h1>
    <form action @submit.prevent novalidate>
      <div class="form-row">
        <div class="form-group col-lg-3">
          <label>Tipo</label>
          <app-form-contact-type-select
            name="type"
            v-model="entity.type"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('type') }"
          ></app-form-contact-type-select>
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-3">
          <label>Criado pelo usuário</label>
          <app-user-select
            v-model="entity.userCreated"
            :readonly="entity.id"
          ></app-user-select>
        </div>
        <div class="form-group col-lg-6">
          <label>Nome da pessoa</label>
          <input
            class="form-control"
            name="personName"
            type="text"
            v-model="entity.personName"
            maxlength="90"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('personName') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-6">
          <label>E-mail</label>
          <input
            class="form-control"
            name="personEmail"
            type="text"
            v-validate="'email'"
            v-model="entity.personEmail"
            maxlength="90"
            :class="{ 'is-invalid': errors.has('personEmail') }"
          />
          <div class="invalid-feedback">Campo deve ser um e-mail.</div>
          <small v-if="entity.personEmail"
            ><a
              :href="`mailto:${entity.personEmail}`"
              v-b-tooltip.hover
              title="Clique para enviar um e-mail através do seu dispositivo."
              >Responder por e-mail.</a
            ></small
          >
        </div>
        <div class="form-group col-lg-6">
          <label>Telefone</label>
          <input
            class="form-control"
            name="personPhone"
            type="text"
            v-mask="['(##) ####-####', '(##) #####-####', '(###) #####-####']"
            v-model="entity.personPhone"
            maxlength="60"
          />
        </div>
        <div class="form-group col-12">
          <label>Assunto do contato</label>
          <input
            class="form-control"
            name="subject"
            type="text"
            v-model="entity.subject"
            maxlength="60"
            v-validate="'required'"
            :class="{ 'is-invalid': errors.has('subject') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-12">
          <label>Mensagem recebida no contato</label>
          <textarea
            class="form-control"
            name="message"
            v-model="entity.message"
            v-validate="'required'"
            rows="5"
            :class="{ 'is-invalid': errors.has('message') }"
          />
          <div class="invalid-feedback">Campo obrigatório.</div>
        </div>
        <div class="form-group col-lg-4">
          <label>Contato recebido pelo IP</label>
          <input
            class="form-control"
            name="remoteIp"
            type="text"
            v-model="entity.remoteIp"
            readonly
          />
        </div>
      </div>
      <br />
      <div class="card">
        <div class="card-header">Informações da resposta</div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group col-12">
              <label>Anotações internas</label>
              <textarea
                class="form-control"
                name="internalNotes"
                v-model="entity.internalNotes"
                placeholder="Estas anotações não serão exibidas para o usuário."
                rows="2"
              />
              <small
                >Estas anotações não ficarão visíveis para o usuário.</small
              >
            </div>
            <div class="form-group col-lg-6">
              <label>Respondido pelo usuário</label>
              <app-user-select v-model="entity.userResponse"></app-user-select>
            </div>
            <div class="form-group col-lg-6">
              <label>Data-hora da resposta</label>
              <app-input-datetime
                v-model="entity.responseDateTime"
              ></app-input-datetime>
              <button
                type="button"
                class="cursor-pointer btn btn-link"
                @click="onResponseNowClick"
                >Setar para agora.</button
              >
            </div>
            <div class="form-group col-12">
              <label>Resposta</label>
              <textarea
                class="form-control"
                name="response"
                placeholder="Escreva aqui a mensagem que fará parte do e-mail de resposta."
                v-model="entity.response"
                rows="5"
              />
            </div>
            <div class="form-group col-12">
              <button
                type="button"
                class="btn btn-success"
                @click="onResponseSendClick"
                :disabled="!entity.response"
              >
                <i class="fas fa-paper-plane"></i> Enviar e-mail de resposta
              </button>
              <br />
              <small
                >Ao enviar, a <strong>resposta</strong> será vinculada ao
                <strong>seu usuário</strong>, salva as
                <strong>anotações internas</strong> e
                <strong>desmarca a opção "Contato precisa de resposta"</strong
                >.</small
              >
            </div>
          </div>
        </div>
      </div>
      <br />
      <h4>Regras</h4>
      <div class="form-row">
        <div class="form-group col-12">
          <div class="form-check">
            <label class="form-check-label">
              <input
                class="form-check-input"
                :class="{
                  'text-danger': entity.needsReview,
                }"
                type="checkbox"
                value="1"
                v-model="entity.needsReview"
              />
              Contato precisa de resposta / revisão.
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
  import { crudMixin } from '@mixins/crud-mixin';
  import axios from '@mixins/axios-auth';

  import UserSelect from '../gl_user/UserSelect.vue';
  import FormContactTypeSelect from './FormContactTypeSelect.vue';

  export default {
    mixins: [crudMixin],
    components: {
      'app-user-select': UserSelect,
      'app-form-contact-type-select': FormContactTypeSelect,
    },
    data() {
      return {
        entity: {
          type: 'contact',
          personName: null,
          personEmail: null,
          personPhone: null,
          subject: null,
          message: null,
          response: null,
          internalNotes: null,
          userCreatedId: null,
          userResponseId: null,
          needsReview: true,
          // objects
          userResponse: null,
          userCreated: null,
        },
      };
    },
    methods: {
      crud_data() {
        return {
          type: this.entity.type,
          personName: this.entity.personName,
          personEmail: this.entity.personEmail,
          personPhone: this.entity.personPhone,
          subject: this.entity.subject,
          message: this.entity.message,
          response: this.entity.response,
          responseDateTime: this.entity.responseDateTime,
          internalNotes: this.entity.internalNotes,
          userCreatedId: this.entity.userCreated
            ? this.entity.userCreated.id
            : null,
          userResponseId: this.entity.userResponse
            ? this.entity.userResponse.id
            : null,
          needsReview: !!this.entity.needsReview,
        };
      },
      crud_validate() {
        return true;
      },
      onResponseNowClick() {
        this.entity.responseDateTime = new Date().toISOString();
      },
      onResponseSendClick() {
        if (
          !confirm(
            'Confirma enviar o e-mail com a resposta para o usuário? \n(O contato também será marcado como resolvido).'
          )
        ) {
          return;
        }
        this.api_loadingShow();
        axios
          .post(`${this.crud_url_base}/${this.id}/sendResponse`, {
            response: this.entity.response,
            internalNotes: this.entity.internalNotes,
          })
          .then(
            this.api_thenDone(res => {
              this.changed = true;
              this.crud_refreshEntity();
            })
          )
          .catch(this.api_catch());
      },
    },
    computed: {
      crud_title() {
        var ok = this.entity != null;
        if (ok) {
          ok = this.entity.id != null;
        }
        if (ok) {
          return `Contato #${this.entity.id} - ${this.entity.subject}`;
        } else {
          return 'Cadastro de Contato';
        }
      },
      crud_url_base() {
        return '/api/admin/gl_form_contact';
      },
      crud_route_base() {
        return 'gl_form_contact';
      },
    },
  };
</script>

<style scoped></style>
