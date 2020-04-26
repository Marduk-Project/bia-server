/**
 * Inits
 */

window.app_routes = require("./routes");
require("../../bootstrap/bootstrap");
require("../../bootstrap/vue-init");

/* === Vue Instance === */
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import store from "../../store/store";

const router = new VueRouter({
  // mode: 'history',
  routes: window.app_routes.default,
});

const divApp = document.body.querySelector("#app");
if (divApp) {
  new Vue({
    el: "#app",
    store,
    router,
    render: (h) => h(App),
  });
}
