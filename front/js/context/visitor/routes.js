// basics
// import Dashboard from '../../components/customer/Dashboard.vue';
import Header from "../../components/visitor/Header.vue";
import NotFound from "../../components/common/NotFound.vue";
import Footer from "../../components/common/Footer.vue";
import Login from "../../components/visitor/auth/Login.vue";
import Logout from "../../components/visitor/auth/Logout.vue";
import RecoverRequest from "../../components/visitor/auth/RecoverRequest.vue";
import RecoverChangePwd from "../../components/visitor/auth/RecoverChangePwd.vue";
// generator-inject-new-file-here
// account
// import MeusDados from '../components/customer/MeusDados.vue';

export default [
  { path: "/", redirect: "/auth/login" },
  {
    path: "/auth/login",
    name: "auth.login",
    components: { default: Login, header: Header, footer: Footer },
  },
  {
    path: "/auth/logout",
    name: "auth.logout",
    components: { default: Logout, header: Header, footer: Footer },
  },
  {
    path: "/auth/recoverRequest",
    name: "auth.recover.request",
    components: { default: RecoverRequest, header: Header, footer: Footer },
  },
  {
    path: "/auth/recover/:token",
    name: "auth.recover.change",
    components: { default: RecoverChangePwd, header: Header, footer: Footer },
  },
  // generator-inject-new-route-here
  // { path: '/dashboard', components: { default: Dashboard, header: Header, footer: Footer }, name: 'conta.dashboard'},
  // any
  {
    path: "*",
    components: { default: NotFound, header: Header, footer: Footer },
  },
];
