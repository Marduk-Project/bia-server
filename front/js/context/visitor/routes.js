// basics
// import Dashboard from '../../components/customer/Dashboard.vue';
import Header from '../../components/visitor/Header.vue';
import NotFound from '../../components/common/NotFound.vue';
import Footer from  '../../components/common/Footer.vue';
import Login from '../../components/visitor/auth/Login.vue';
import Logout from '../../components/visitor/auth/Logout.vue';
import RecoverRequest from '../../components/visitor/auth/RecoverRequest.vue';
import RecoverChangePwd from '../../components/visitor/auth/RecoverChangePwd.vue';
// account
import AccountList from '../../components/visitor/auth/AccountList.vue';
// import MeusDados from '../components/customer/MeusDados.vue';
// // configuracoes
// import Configuracoes from '../components/customer/config/Container.vue';
// import ConfigMenu from '../components/customer/config/Menu.vue';
// import ConfigGeral from '../components/customer/config/Geral.vue';

export default [
    { path: '/', redirect: '/auth/login' },
    { path: '/auth/login', name: 'auth.login', components: { default: Login, header: Header, footer: Footer }},
    { path: '/auth/logout', name: 'auth.logout', components: { default: Logout, header: Header, footer: Footer }},
    { path: '/auth/recoverRequest', name: 'auth.recover.request', components: { default: RecoverRequest, header: Header, footer: Footer }},
    { path: '/auth/recover/:token', name: 'auth.recover.change', components: { default: RecoverChangePwd, header: Header, footer: Footer }},
    { path: '/account', name: 'account.index', components: { default: AccountList, header: Header, footer: Footer }},
    // { path: '/dashboard', components: { default: Dashboard, header: Header, footer: Footer }, name: 'conta.dashboard'},
    // { path: '/cadastros', components: { default: CadastrosMenu, header: Header, footer: Footer }, name: 'cadastros' },
    // { path: '/meusdados', components: { default: MeusDados, header: Header, footer: Footer }, name: 'meusdados' },
    // { 
    //     path: '/config/', components: { default: Configuracoes, header: Header, footer: Footer },
    //     children: [
    //         { path: '', components: { menu: ConfigMenu, content: ConfigGeral } },
    //     ]
    // },
    // === cadastros
    // === movimentos
    // any
    { path: '*', components: { default: NotFound, header: Header, footer: Footer } }
];
