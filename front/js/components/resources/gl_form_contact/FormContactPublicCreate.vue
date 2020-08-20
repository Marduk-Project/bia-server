<template>
  <div>
    <div class="app-bg-image"></div>
    <div class="container">
      <br />
      <br />
      <br />
      <br />
      <div
        class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12 app-bg-light"
      >
        <button
          type="button"
          @click="onNavBackClick"
          v-if="navBackRoute"
          class="btn btn-link mt-3"
        >
          <i class="fas fa-chevron-left"></i> Voltar
        </button>
        <br />
        <div class="text-center">
          <img
            class="img-fluid"
            src="../../../../img/theme/logo-vertical.png"
            style="max-width: 250px;"
            alt
          />
        </div>
        <br />
        <h4 class="text-center">Fale conosco</h4>
        <br />
        <p class="text-muted">
          Para <strong>cadastro de Entidade</strong>,
          <strong>ajuda/doações</strong> ou <strong>dúvidas</strong>, por favor
          entre em contato conosco pelo formulário abaixo.
          <br />
          Vamos responder o mais breve que conseguirmos.
        </p>
        <div class="form-row">
          <div class="form-group col-12">
            <label>Tipo do contato</label>
            <app-form-contact-type-select
              name="type"
              v-model="formContact.type"
              v-validate="'required'"
              :class="{ 'is-invalid': errors.has('type') }"
            ></app-form-contact-type-select>
            <div class="invalid-feedback">Campo obrigatório.</div>
          </div>
          <div class="form-group col-12">
            <label>Digite seu nome</label>
            <input
              name="personName"
              type="text"
              class="form-control"
              v-model="formContact.personName"
              v-validate="'required'"
              :class="{ 'is-invalid': errors.has('personName') }"
            />
            <div class="invalid-feedback">Campo obrigatório.</div>
          </div>
          <div class="form-group col-lg-6">
            <label>E-mail</label>
            <input
              name="personEmail"
              type="text"
              class="form-control"
              v-model="formContact.personEmail"
              v-validate="'required|email'"
              :class="{ 'is-invalid': errors.has('personEmail') }"
            />
            <div class="invalid-feedback"
              >Campo obrigatório. Deve ser um e-mail válido.</div
            >
          </div>
          <div class="form-group col-lg-6">
            <label>Telefone</label>
            <input
              name="personPhone"
              type="text"
              class="form-control"
              v-model="formContact.personPhone"
              v-validate="'required'"
              v-mask="['(##) ####-####', '(##) #####-####', '(###) #####-####']"
              :class="{ 'is-invalid': errors.has('personPhone') }"
            />
            <div class="invalid-feedback">Campo obrigatório.</div>
          </div>
          <div class="form-group col-12">
            <label>Assunto</label>
            <input
              name="subject"
              type="text"
              class="form-control"
              v-model="formContact.subject"
              v-validate="'required'"
              :class="{ 'is-invalid': errors.has('subject') }"
            />
            <div class="invalid-feedback">Campo obrigatório.</div>
          </div>
          <div class="form-group col-12">
            <label>Sua mensagem</label>
            <textarea
              name="message"
              type="text"
              class="form-control"
              placeholder="Caso seja uma entidade, informe seus dados cadastrais."
              v-model="formContact.message"
              v-validate="'required'"
              :class="{ 'is-invalid': errors.has('message') }"
              rows="3"
            />
            <div class="invalid-feedback">Campo obrigatório.</div>
            <small
              >Caso seja uma entidade que deseja se cadastrar,
              <strong>informe os dados cadastrais</strong> da sua entidade, como
              <strong>CNPJ/CPF</strong>, <strong>razão social</strong>,
              <strong>endereço</strong>, <strong>município</strong> etc.</small
            >
          </div>
          <div class="form-group col-12 mb-3" v-show="recaptcha_enabled">
            <div id="my-recaptcha"></div>
          </div>
          <div class="form-group col-12">
            <button
              class="w-100 btn btn-success"
              type="button"
              @click="onSendClick"
              :disabled="!form_enabled"
            >
              <i class="fa fa-sign-in"></i> Enviar
            </button>
          </div>
        </div>
        <br />
        <div class="form-row">
          <div class="form-group col-12">
            <router-link
              type="button"
              tag="button"
              :to="{ name: 'or_order.state.select' }"
              class="w-100 btn btn-link"
            >
              Ir para Dashboard dos Estados
            </router-link>
          </div>
          <div class="form-group col-12">
            <router-link
              class="w-100 btn btn-link"
              tag="button"
              type="button"
              :to="{ name: 'auth.login' }"
            >
              <i class="fas fa-sign-in-alt"></i> Ir para Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  import { apiMixin } from '@mixins/api-mixin';
  import { recaptchaMixin } from '@mixins/recaptcha-mixin';
  import FormContactTypeSelect from './FormContactTypeSelect.vue';

  export default {
    mixins: [apiMixin, recaptchaMixin],
    components: {
      'app-form-contact-type-select': FormContactTypeSelect,
    },
    computed: {
      form_enabled() {
        if (this.recaptcha_enabled) {
          return this.recaptcha_isReady;
        }
        return false;
      },
      navBackRoute() {
        if (this.$route.params.navBackRoute) {
          return this.$route.params.navBackRoute;
        }
        return false;
      },
    },
    data() {
      return {
        wasValidated: false,
        formContact: {
          type: 'contact',
          personName: null,
          personEmail: null,
          personPhone: null,
          subject: null,
          message: null,
        },
      };
    },
    methods: {
      onSendClick() {
        if (!this.form_enabled) {
          return;
        }
        this.$validator.validateAll().then(result => {
          this.wasValidated = true;
          if (!result) {
            return;
          }
          let data = this.formContact;
          if (this.recaptcha_enabled) {
            data.recaptchaToken = this.recaptcha.token;
          }
          this.api_loadingShow();
          axios
            .post('/api/visitor/gl_form_contact/create', data)
            .then(
              this.api_thenDone(res => {
                this.$router.push({
                  name: 'gl_form_contact.done',
                  params: {
                    navBackRoute: this.navBackRoute,
                  },
                });
              })
            )
            .catch(
              this.api_catch(error => {
                this.recaptcha_reset();
              })
            );
        });
      },
      onNavBackClick() {
        this.$router.push(this.navBackRoute);
      },
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Formulário de contato');
      if (this.$route.params.type) {
        this.formContact.type = this.$route.params.type;
      }
      this.recaptcha_initIfNeeded();
    },
  };
</script>

<style type="text/css" scoped></style>
