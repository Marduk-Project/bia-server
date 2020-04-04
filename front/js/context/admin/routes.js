// basics
import Dashboard from '../../components/admin/Dashboard.vue';
import Header from '../../components/admin/Header.vue';
import NotFound from '../../components/common/NotFound.vue';
import Footer from '../../components/common/Footer.vue';
// users
import Profile from '../../components/resources/user/Profile.vue';
import UserEdit from '../../components/resources/user/UserEdit.vue';
import UserList from '../../components/resources/user/UserList.vue';
// account
import AccountEdit from '../../components/resources/account/AccountEdit.vue';
import AccountList from '../../components/resources/account/AccountList.vue';
import AccountUserList from '../../components/resources/account/AccountUserList.vue';
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
  // account
  , { path: '/account', components: { default: AccountList, header: Header, footer: Footer }, name: 'account.index' }
  , { path: '/account/:id/edit', components: { default: AccountEdit, header: Header, footer: Footer }, name: 'account.edit' }
  , { path: '/account/create', components: { default: AccountEdit, header: Header, footer: Footer }, name: 'account.create' }
  , { path: '/account/:parentEntityId/user', components: { default: AccountUserList, header: Header, footer: Footer }, name: 'account_user.index' }
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
