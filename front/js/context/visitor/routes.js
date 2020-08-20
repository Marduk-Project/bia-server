// basics
// import Dashboard from '../../components/customer/Dashboard.vue';
import Header from '../../components/visitor/Header.vue';
import HeaderDashboard from '../../components/visitor/HeaderDashboard.vue';
import NotFound from '../../components/common/NotFound.vue';
import Footer from '../../components/common/Footer.vue';
import Login from '../../components/visitor/auth/Login.vue';
import Logout from '../../components/visitor/auth/Logout.vue';
import RecoverRequest from '../../components/visitor/auth/RecoverRequest.vue';
import RecoverChangePwd from '../../components/visitor/auth/RecoverChangePwd.vue';
import OrOrderStateDashboard from '../../components/resources/or_order/dashboards/StateDashboard.vue';

import StateDashboardSelect from '../../components/visitor/StateDashboardSelect.vue';

import FormContactPublicCreate from '../../components/resources/gl_form_contact/FormContactPublicCreate.vue';
import FormContactPublicDone from '../../components/resources/gl_form_contact/FormContactPublicDone.vue';

import AboutDevelopers from '../../components/visitor/about/AboutDevelopers.vue';

// generator-inject-new-file-here
// account
// import MeusDados from '../components/customer/MeusDados.vue';

export default [
  { path: '/', redirect: '/auth/login' },
  // login
  {
    path: '/auth/login',
    name: 'auth.login',
    components: { default: Login, header: Header, footer: Footer },
  },
  // logout
  {
    path: '/auth/logout',
    name: 'auth.logout',
    components: { default: Logout, header: Header, footer: Footer },
  },
  // recover password
  {
    path: '/auth/recoverRequest',
    name: 'auth.recover.request',
    components: { default: RecoverRequest, header: Header, footer: Footer },
  },
  {
    path: '/auth/recover/:token',
    name: 'auth.recover.change',
    components: { default: RecoverChangePwd, header: Header, footer: Footer },
  },
  // about devs
  {
    path: '/about/devs',
    name: 'about.devs',
    components: { default: AboutDevelopers, header: Header, footer: Footer },
  },
  // form contact
  {
    path: '/gl_form_contact/create',
    name: 'gl_form_contact.create',
    components: {
      default: FormContactPublicCreate,
      header: Header,
      footer: Footer,
    },
  },
  // form contact
  {
    path: '/gl_form_contact/done',
    name: 'gl_form_contact.done',
    components: {
      default: FormContactPublicDone,
      header: Header,
      footer: Footer,
    },
  },
  // or order state select
  {
    path: '/or_order/state',
    name: 'or_order.state.select',
    components: {
      default: StateDashboardSelect,
      header: Header,
      footer: Footer,
    },
  },
  // or order dashboard
  {
    path: '/or_order/state/:id/dashboard',
    name: 'or_order.state.dashboard',
    components: {
      default: OrOrderStateDashboard,
      header: HeaderDashboard,
      footer: Footer,
    },
  },
  // generator-inject-new-route-here
  // { path: '/dashboard', components: { default: Dashboard, header: Header, footer: Footer }, name: 'conta.dashboard'},
  // any
  {
    path: '*',
    components: { default: NotFound, header: Header, footer: Footer },
  },
];
