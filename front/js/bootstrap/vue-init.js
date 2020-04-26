// vue
import Vue from "vue";
import VueRouter from "vue-router";
import VeeValidate from "vee-validate";
import ValidatorExt from "../libs/extensions/validator";
import BootstrapVue from "bootstrap-vue";
import VueTheMask from "vue-the-mask";
import VueLazyLoad from "vue-lazyload";
import _ from "lodash";

// moment
import moment from "moment";
moment.locale("pt-BR"); // todo pensar em config

// store
import store from "../store/store";

// uses
Vue.use(VueRouter);
Vue.use(VeeValidate);
Vue.use(BootstrapVue);
Vue.use(VueTheMask);
Vue.use(VueLazyLoad);

// === components
// inputs
import InputDate from "../libs/components/form/InputDate.vue";
import InputDateTime from "../libs/components/form/InputDateTime.vue";
import InputDecimal from "../libs/components/form/InputDecimal.vue";

Vue.component("app-input-date", InputDate);
Vue.component("app-input-datetime", InputDateTime);
Vue.component("app-input-decimal", InputDecimal);
// spans
import DateTimeSpan from "../libs/components/item/DateTimeSpan.vue";
import DateTimeRealSpan from "../libs/components/item/DateTimeRealSpan.vue";
import DateSpan from "../libs/components/item/DateSpan.vue";
import DecimalSpan from "../libs/components/item/DecimalSpan.vue";
Vue.component("app-datetime-span", DateTimeSpan);
Vue.component("app-datetime-real-span", DateTimeRealSpan);
Vue.component("app-date-span", DateSpan);
Vue.component("app-decimal-span", DecimalSpan);

// other
import Info from "../libs/components/common/Info.vue";
import Identificator from "../libs/components/common/Identificator.vue";
import EntityBaseInfo from "../components/common/EntityBaseInfo.vue";
import RefreshButton from "../libs/components/common/RefreshButton.vue";
import Pagination from "../libs/components/crud/Pagination.vue";
Vue.component("app-info", Info);
Vue.component("app-id", Identificator);
Vue.component("app-entitybaseinfo", EntityBaseInfo);
Vue.component("app-refresh-button", RefreshButton);
Vue.component("app-pagination", Pagination);

ValidatorExt.initialize();

// filters
Vue.filter("truncate", function (text, stop, clamp) {
  if (text) {
    return text.slice(0, stop) + (stop < text.length ? clamp || "..." : "");
  }
  return "";
});

// const router = new VueRouter({
//   // mode: 'history',
//   routes: window.app_routes.default,
// });

// router.beforeEach((to, from, next) => {
//   if (to.meta) {
//     if (to.meta.title) {
//       if (_.isFunction(to.meta.title)) {
//         document.title = to.meta.title(to);
//       } else {
//         document.title = to.meta.title;
//       }
//     }
//   }
//   next();
// });

/* === check logado api === */
var app_hidden, app_visibilityChange;
if (typeof document.hidden !== "undefined") {
  // Opera 12.10 and Firefox 18 and later support
  app_hidden = "hidden";
  app_visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  app_hidden = "msHidden";
  app_visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  app_hidden = "webkitHidden";
  app_visibilityChange = "webkitvisibilitychange";
}

function app_handleVisibilityChange() {
  if (document[app_hidden]) {
    window.app_windowActive = false;
  } else {
    window.app_windowActive = true;
    store.dispatch("checkReloadSession");
  }
}

// no inicio marca true
window.app_windowActive = true;
if (
  typeof document.addEventListener === "undefined" ||
  typeof document.hidden === "undefined"
) {
  // console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
  document.addEventListener(
    app_visibilityChange,
    app_handleVisibilityChange,
    false
  );
}

// realiza reload de sessao a cada x min
if (window.app_loggedIn) {
  setInterval(() => store.dispatch("checkReloadSession"), 60 * 5 * 1000);
}
