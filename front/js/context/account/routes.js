// basics
import Dashboard from '../../components/account/Dashboard.vue';
import Header from '../../components/account/Header.vue';
import NotFound from '../../components/common/NotFound.vue';
import Footer from '../../components/common/Footer.vue';
// gl_user
import GL_Profile from '@resources/gl_user/Profile.vue';

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
  // generator-inject-new-route-here
  // any
  {
    path: '*',
    components: { default: NotFound, header: Header, footer: Footer },
  },
];
