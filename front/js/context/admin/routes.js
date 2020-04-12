// basics
import Dashboard from '../../components/admin/Dashboard.vue';
import Header from '../../components/admin/Header.vue';
import NotFound from '../../components/common/NotFound.vue';
import Footer from '../../components/common/Footer.vue';
// users
import GL_Profile from '../../components/resources/gl_user/Profile.vue';
import GL_UserEdit from '../../components/resources/gl_user/UserEdit.vue';
import GL_UserList from '../../components/resources/gl_user/UserList.vue';
// PPE requests
import OR_RequestList from '../../components/resources/or_request/RequestList.vue';
// maintenance
import Man_Container from '../../components/admin/maintenance/Container.vue';
import Man_Menu from '../../components/admin/maintenance/Menu.vue';
import Man_General from '../../components/admin/maintenance/General.vue';
import Man_ConfigFileEdit from '../../components/admin/maintenance/EditConfigFile.vue';

export default [
  { path: '/', redirect: '/dashboard' }
  , { path: '/dashboard', components: { default: Dashboard, header: Header, footer: Footer }, name: 'dashboard' }
  , { path: '/gl_user/profile', components: { default: GL_Profile, header: Header, footer: Footer }, name: 'user.profile' }
  // user
  , { path: '/gl_user', components: { default: GL_UserList, header: Header, footer: Footer }, name: 'gl_user.index' }
  , { path: '/gl_user/:id/edit', components: { default: GL_UserEdit, header: Header, footer: Footer }, name: 'gl_user.edit' }
  , { path: '/gl_user/create', components: { default: GL_UserEdit, header: Header, footer: Footer }, name: 'gl_user.create' }
  // PPE requests
  , { path: '/or_request', components: {default: OR_RequestList, header: Header, footer: Footer}, name: 'or_request.index'}
  // maintenance
  , {
    path: '/maintenance', components: { default: Man_Container, header: Header, footer: Footer },
    children: [
      { path: '', redirect: { name: 'maintenance.general' } },
      { path: 'general', components: { menu: Man_Menu, content: Man_General }, name: 'maintenance.general' },
      { path: 'config/edit', components: { menu: Man_Menu, content: Man_ConfigFileEdit }, name: 'config.edit' },
    ]
  }
  // any
  , { path: '*', components: { default: NotFound, header: Header, footer: Footer } }
];
