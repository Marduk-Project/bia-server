// basics
import Dashboard from '../../components/admin/Dashboard.vue';
import Header from '../../components/admin/Header.vue';
import NotFound from '../../components/common/NotFound.vue';
import Footer from '../../components/common/Footer.vue';
// users
import Profile from '../../components/resources/user/Profile.vue';
import UserEdit from '../../components/resources/user/UserEdit.vue';
import UserList from '../../components/resources/user/UserList.vue';
// maintenance
import Man_Container from '../../components/admin/maintenance/Container.vue';
import Man_Menu from '../../components/admin/maintenance/Menu.vue';
import Man_General from '../../components/admin/maintenance/General.vue';
import Man_ConfigFileEdit from '../../components/admin/maintenance/EditConfigFile.vue';

export default [
  { path: '/', redirect: '/dashboard' }
  , { path: '/dashboard', components: { default: Dashboard, header: Header, footer: Footer }, name: 'dashboard' }
  , { path: '/user/profile', components: { default: Profile, header: Header, footer: Footer }, name: 'user.profile' }
  // user
  , { path: '/user', components: { default: UserList, header: Header, footer: Footer }, name: 'user.index' }
  , { path: '/user/:id/edit', components: { default: UserEdit, header: Header, footer: Footer }, name: 'user.edit' }
  , { path: '/user/create', components: { default: UserEdit, header: Header, footer: Footer }, name: 'user.create' }
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
