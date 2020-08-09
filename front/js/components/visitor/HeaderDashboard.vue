<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto"> </ul>
      <div class="d-inline-flex">
        <ul class="navbar-nav mr-auto">
          <li>
            <a
              href="https://brothersinarms.cc/"
              class="nav-link"
              target="_site"
            >
              Site do Brothers
            </a>
          </li>
          <li>
            <router-link
              tag="a"
              :to="{
                name: 'gl_form_contact.create',
                params: {
                  type: 'supply',
                  navBackRoute: {
                    name: 'or_order.state.dashboard',
                    params: {
                      id: $route.params.id,
                    },
                  },
                },
              }"
              class="nav-link"
            >
              Quero ajudar
            </router-link>
          </li>
          <li>
            <router-link
              tag="a"
              :to="{
                name: 'gl_form_contact.create',
                params: {
                  type: 'entity',
                  navBackRoute: {
                    name: 'or_order.state.dashboard',
                    params: {
                      id: $route.params.id,
                    },
                  },
                },
              }"
              class="nav-link"
            >
              Quero me cadastrar
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters({
        isUserAdmin: 'isUserAdmin',
        isUserStaff: 'isUserStaff',
        userName: 'getUserName',
        userNickname: 'getUserNickname',
        // isEnvProduction: "isEnvProduction"
      }),
      app_current_name() {
        return window.app_short_name;
      },
    },
  };
</script>

<style scoped>
  nav .fa,
  nav .fas,
  nav .far,
  nav .fab {
    width: 22px;
    text-align: center;
    margin-right: 2px;
  }
</style>
