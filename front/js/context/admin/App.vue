<template>
  <div>
    <router-view name="header"></router-view>
    <router-view></router-view>
    <router-view name="footer"></router-view>
    <app-notify></app-notify>
    <transition name="ldfade" appear>
      <div v-if="isLoading" class="app-loading">
        <div class="d-flex justify-content-center align-items-center">
          <i class="fa fa-spin fa-circle-o-notch fa-5x"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import util from "util";
import Notify from "../../libs/components/common/Notify";

export default {
  components: {
    "app-notify": Notify,
  },
  computed: {
    ...mapGetters(["isLoading"]),
  },
  methods: {
    checkFlashesMessages() {
      if (util.isArray(window.app_flashes)) {
        window.app_flashes.forEach((message) => {
          this.$store.dispatch("notify", message);
        });
      } else {
        console.warn("Flash messages not configured!");
      }
    },
  },
  created() {
    // var vm = this;
    if (window.app_loggedIn) {
      this.$store.dispatch("loadSession");
    }
  },
  mounted() {
    this.checkFlashesMessages();
  },
};
</script>

<style lang="sass">
@import '../../../sass/app.scss'
</style>

<style type="text/css" scoped>
/* === loading position === */

.app-loading {
  opacity: 0.7;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999999;
  background-color: #000;
}

.app-loading div {
  width: 100%;
  height: 100%;
}

/* === loading anim === */

.ldfade-enter {
  opacity: 0;
}

.ldfade-enter-active {
  transition: opacity 0.3s;
}

.ldfade-enter-to {
  opacity: 0.7;
}

.ldfade-leave {
  opacity: 0.7;
}

.ldfade-leave-active {
  transition: opacity 0.3s;
}

.ldfade-leave-to {
  opacity: 0;
}
</style>
