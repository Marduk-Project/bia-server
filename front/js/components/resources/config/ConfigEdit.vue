<template>
  <div v-if="entity" class="container">
    <br />
    <button type="button" class="btn btn-link" @click="crud_navBack">
      <i class="fa fa-chevron-left"></i> Voltar
    </button>
    <br />
    <h1>{{ crud_title }}</h1>
    <p class="text-danger">
      <strong>Atenção!</strong> Configurações erradas podem comprometer o
      funcionamento do sistema. <br />Apenas administradores podem alterar este
      cadastro.
    </p>
    <form action @submit.prevent novalidate>
      <h4>Alertas</h4>
      <div class="form-row">
        <div class="form-group col-lg-4">
          <label>Cor - mínimo</label>
          <input
            class="form-control"
            type="color"
            v-model="entity.alert.color_lh_low"
          />
        </div>
        <!-- futuro -->
        <!-- <div class="form-group col-lg-4">
          <label>Cor - intermediário</label>
          <input class="form-control" type="color" v-model="entity.alert.color_lh_mid">
        </div>-->
        <div class="form-group col-lg-4">
          <label>Cor - máximo</label>
          <input
            class="form-control"
            type="color"
            v-model="entity.alert.color_lh_high"
          />
        </div>
      </div>
      <br />
      <div class="form-row">
        <app-crud-buttons
          @onSave="crud_onSaveAction"
          :delete-show="false"
        ></app-crud-buttons>
      </div>
    </form>
  </div>
</template>

<script>
import { apiMixin } from '@mixins/api-mixin'
import axios from '@mixins/axios-auth'
import CrudButtons from '@libComponents/crud/CrudButtons.vue'

export default {
  mixins: [apiMixin],
  components: {
    'app-crud-buttons': CrudButtons,
  },
  data() {
    return {
      entity: {
        id: 1,
        alert: {
          color_lh_high: '#FF0000',
          color_lh_mid: '#DDDD00',
          color_lh_low: '#00AA00',
        },
      },
    }
  },
  methods: {
    crud_data() {
      return {
        alert: this.entity.alert,
      }
    },
    crud_navBack() {
      this.$router.push({
        name: 'dashboard',
      })
    },
    crud_requestEntity() {
      var url = this.crud_url_edit
      if (!url) {
        url = this.crud_url_base + '/edit'
      }
      this.api_loadingShow()
      axios
        .get(url)
        .then(res => {
          this.api_loadingHide()
          this.entity = res.data.data
        })
        .catch(this.api_catch())
    },
    crud_onSaveAction() {
      this.api_loadingShow()
      axios
        .put(this.crud_url_base, this.crud_data())
        .then(
          this.api_thenDone(res => {
            this.crud_navBack()
          })
        )
        .catch(this.api_catch())
    },
  },
  computed: {
    crud_title() {
      return 'Configurações da conta'
    },
    crud_url_base() {
      return '/api/account/config'
    },
    crud_route_base() {
      return 'config'
    },
  },
  mounted() {
    this.crud_requestEntity()
  },
}
</script>

<style scoped></style>
