// basics
import Dashboard from '../../components/account/Dashboard.vue';
import Header from '../../components/account/Header.vue';
import NotFound from '../../components/common/NotFound.vue';
import Footer from '../../components/common/Footer.vue';
// gl_user
import GL_Profile from '@resources/gl_user/Profile.vue';
// or_order
import OR_OrderList from '@resources/or_order/OrderList.vue';
import OR_OrderEdit from '@resources/or_order/OrderEdit.vue';
// or_order_consolidated
import OR_OrderConsolidatedList from '@resources/or_order_consolidated/OrderConsolidatedList.vue';

// generator-inject-new-file-here

export default [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    components: { default: Dashboard, header: Header, footer: Footer },
    name: 'dashboard',
  },
  {
    path: '/gl_user/profile',
    components: { default: GL_Profile, header: Header, footer: Footer },
    name: 'user.profile',
  },
  // or_order
  {
    path: '/or_order',
    components: { default: OR_OrderList, header: Header, footer: Footer },
    name: 'or_order.index',
  },
  {
    path: '/or_order/:id/edit',
    components: { default: OR_OrderEdit, header: Header, footer: Footer },
    name: 'or_order.edit',
  },
  {
    path: '/or_order/create',
    components: { default: OR_OrderEdit, header: Header, footer: Footer },
    name: 'or_order.create',
  },
  // or_order_consolidated
  {
    path: '/or_order_consolidated',
    components: {
      default: OR_OrderConsolidatedList,
      header: Header,
      footer: Footer,
    },
    name: 'or_order_consolidated.index',
  },
  // generator-inject-new-route-here
  // any
  {
    path: '*',
    components: { default: NotFound, header: Header, footer: Footer },
  },
];
