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
          >Ir</a>
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
          >Cadastros</a>
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
          </div>
        </li>
      </ul>
      <div class="d-inline-flex">
        <ul class="navbar-nav mr-auto">
          <li v-show="isUserAdmin" class="nav-item dropdown">
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
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
              <!-- <a class="dropdown-item" href="/admin/maintenance/logs" target="_blank">
                <i class="fas fa-file-code"></i> Logs
              </a>-->
              <router-link class="dropdown-item" to="/maintenance" tag="a" active-class="active">
                <i class="fas fa-cogs"></i> Manutenção
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
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
              <router-link
                :to="{ name: 'user.profile', params: { routeBack: '/dashboard' } }"
                tag="a"
                class="dropdown-item"
                active-class="active"
              >
                <a>
                  <i class="fas fa-user-circle"></i> Meus dados
                </a>
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
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      isUserAdmin: "isUserAdmin",
      isUserStaff: "isUserStaff",
      userName: "getUserName",
      userNickname: "getUserNickname"
      // isEnvProduction: "isEnvProduction"
    }),
    app_current_name() {
      return window.app_short_name;
    }
  }
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