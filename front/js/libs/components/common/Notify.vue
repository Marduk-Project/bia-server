<template>
  <div>
    <transition name="nf-fade" appear>
      <div
        v-if="showNotification > 0"
        class="app-notification rounded bg-success text-white"
      >
        <div class="fas fa-5x fa-check"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import EventBus from '../../../bootstrap/event-bus';

export default {
  data() {
    return {
      showNotification: 0,
    };
  },
  mounted() {
    EventBus.$on('notify_done', payLoad => {
      this.showNotification += 1;
      setTimeout(() => {
        this.showNotification -= 1;
      }, 3000);
    });
  },
};
</script>

<style scoped>
.app-notification {
  min-width: 100px;
  margin-left: -50px;
  opacity: 0.7;
  text-align: center;
  padding: 16px;
  position: fixed;
  z-index: 999999;
  left: 50%;
  top: 120px;
}

.app-notification-show {
  visibility: visible !important;
  -webkit-animation: nkf_fadein 0.5s, nkf_fadeout 0.5s 2.5s;
  animation: nkf_fadein 0.5s, nkf_fadeout 0.5s 2.5s;
}

/* === loading anim === */

.nf-fade-enter {
  opacity: 0;
}

.nf-fade-enter-active {
  transition: opacity 0.3s;
}

.nf-fade-enter-to {
  opacity: 0.7;
}

.nf-fade-leave {
  opacity: 0.7;
}

.nf-fade-leave-active {
  transition: opacity 0.3s;
}

.nf-fade-leave-to {
  opacity: 0;
}
</style>
