<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="/admin">{{ app_current_name }}</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarText"
      aria-controls="navbarText"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            >Ir</a
          >
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="/admin">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarCrudDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            >Cadastros</a
          >
          <div class="dropdown-menu" aria-labelledby="navbarCrudDropdown">
            <router-link
              class="dropdown-item"
              tag="a"
              active-class="active"
              :to="{ name: 'gl_user.index' }"
              v-if="isUserStaff"
            >
              <i class="fas fa-user"></i> Usuários
            </router-link>
            <router-link
              class="dropdown-item"
              tag="a"
              active-class="active"
              :to="{ name: 'gl_person.index' }"
              v-if="isUserStaff"
            >
              <i class="fas fa-building"></i> Pessoas
            </router-link>
          </div>
        </li>
      </ul>
      <div class="d-inline-flex">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fas fa-cog"></i>
            </a>
            <div
              class="dropdown-menu dropdown-menu-right"
              aria-labelledby="navbarDropdown"
            >
              <!-- <a class="dropdown-item" href="/admin/maintenance/logs" target="_blank">
                <i class="fas fa-file-code"></i> Logs
              </a>-->
              <router-link
                class="dropdown-item"
                to="/maintenance"
                tag="a"
                active-class="active"
                v-show="isUserAdmin"
              >
                <i class="fas fa-cogs"></i> Manutenção
              </router-link>
              <router-link
                class="dropdown-item"
                tag="a"
                active-class="active"
                :to="{ name: 'gl_country.index' }"
                v-if="isUserStaff"
              >
                <i class="fas fa-globe"></i> Países
              </router-link>
              <router-link
                class="dropdown-item"
                tag="a"
                active-class="active"
                :to="{ name: 'gl_state.index' }"
                v-if="isUserStaff"
              >
                <i class="fas fa-globe-americas"></i> Estados
              </router-link>
              <router-link
                class="dropdown-item"
                tag="a"
                active-class="active"
                :to="{ name: 'gl_city.index' }"
                v-if="isUserStaff"
              >
                <i class="fas fa-city"></i> Cidades
              </router-link>
              <router-link
                class="dropdown-item"
                tag="a"
                active-class="active"
                :to="{ name: 'gl_field.index' }"
                v-if="isUserStaff"
              >
                <i class="fas fa-list"></i> Campos dinâmicos
              </router-link>
              <router-link
                class="dropdown-item"
                tag="a"
                active-class="active"
                :to="{ name: 'gl_unit.index' }"
                v-if="isUserStaff"
              >
                <i class="fas fa-ruler-vertical"></i> Unidades de medida
              </router-link>
              <router-link
                class="dropdown-item"
                tag="a"
                active-class="active"
                :to="{ name: 'gl_product.index' }"
                v-if="isUserStaff"
              >
                <i class="far fa-square"></i> Produtos
              </router-link>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fa fa-user-circle"></i>
              {{ userNickname }}
            </a>
            <div
              class="dropdown-menu dropdown-menu-right"
              aria-labelledby="navbarDropdown"
            >
              <router-link
                :to="{
                  name: 'user.profile',
                  params: { routeBack: '/dashboard' },
                }"
                tag="a"
                class="dropdown-item"
                active-class="active"
              >
                <a> <i class="fas fa-user-circle"></i> Meus dados </a>
              </router-link>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="/logout">
                <i class="fa fa-sign-out-alt"></i> Logout
              </a>
            </div>
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
