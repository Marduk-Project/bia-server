<template>
  <div class="container-fluid">
    <div class="app-bg-image"></div>
    <div class="container">
      <br />
      <br />
      <br />
      <br />
      <div class="col-12 app-bg-light">
        <button type="button" @click="onNavBackClick" class="btn btn-link mt-3">
          <i class="fas fa-times"></i> Fechar
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
        <h4 class="text-center">Conheça o time de Desenvolvimento</h4>
        <br />
        <div class="row" v-if="devList.length > 0">
          <div
            class="col-md-4 d-flex"
            v-for="(devObj, devIdx) in devList"
            :key="devIdx"
          >
            <div class="card card-body flex-fill mb-3">
              <div class="text-center">
                <img
                  v-if="devObj.pictureUrl"
                  class="rounded-circle"
                  :src="devObj.pictureUrl"
                  :alt="devObj.name"
                  style="height: 150px; max-width: 150px;"
                />
                <div
                  v-if="!devObj.pictureUrl"
                  style="height: 150px;"
                  class="d-flex flex-column justify-content-center align-content-center"
                >
                  <i class="fas fa-user fa-5x" style="color: lightgrey;"></i>
                </div>
              </div>
              <br />
              <p class="card-title"
                ><strong>{{ devObj.name }}</strong></p
              >
              <p class="card-subtitle">{{ devObj.title }}</p>
              <p class="card-text text-muted mt-3">
                {{ devObj.description }}
              </p>
              <div v-if="devObj.links">
                <div class="list-group">
                  <a
                    :href="link.url"
                    class="list-group-item"
                    v-for="(link, linkIdx) in devObj.links"
                    :key="linkIdx"
                    :target="`__${link.type}`"
                    v-b-tooltip.hover
                    :title="link.title ? link.title : link.type"
                  >
                    <i
                      class="mr-3"
                      :class="{
                        'fab fa-instagram': link.type == 'instagram',
                        'fab fa-facebook-square': link.type == 'facebook',
                        'fab fa-twitter': link.type == 'twitter',
                        'fab fa-linkedin': link.type == 'linkedin',
                        'fas fa-external-link-alt': link.type == 'link',
                        'fas fa-envelope': link.type == 'mail',
                      }"
                    ></i>
                    {{ link.info }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  import { apiMixin } from '@mixins/api-mixin';

  export default {
    mixins: [apiMixin],
    data() {
      return {
        devList: [],
      };
    },
    methods: {
      onNavBackClick() {
        window.close();
      },
      requestDevListInfo() {
        this.api_loadingShow();
        axios
          .get('/api/admin/sy_config/s/PROJECT_DEVELOPERS_JSON')
          .then(res => {
            if (this.api_parseOK(res.data)) {
              this.devList = res.data.data.devList;
            }
            this.api_loadingHide();
          })
          .catch(this.api_catch());
      },
    },
    mounted() {
      this.requestDevListInfo();
    },
  };
</script>

<style></style>
