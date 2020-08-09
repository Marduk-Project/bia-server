// basics
import Dashboard from '../../components/admin/Dashboard.vue';
import Header from '../../components/admin/Header.vue';
import NotFound from '../../components/common/NotFound.vue';
import Footer from '../../components/common/Footer.vue';

// gl_user
import GL_Profile from '@resources/gl_user/Profile.vue';
import GL_UserList from '@resources/gl_user/UserList.vue';
import GL_UserEdit from '@resources/gl_user/UserEdit.vue';

// gl_country
import GL_CountryList from '@resources/gl_country/CountryList.vue';
import GL_CountryEdit from '@resources/gl_country/CountryEdit.vue';

// gl_state
import GL_StateList from '@resources/gl_state/StateList.vue';
import GL_StateEdit from '@resources/gl_state/StateEdit.vue';

// gl_city
import GL_CityList from '@resources/gl_city/CityList.vue';
import GL_CityEdit from '@resources/gl_city/CityEdit.vue';

// gl_person
import GL_PersonList from '@resources/gl_person/PersonList.vue';
import GL_PersonEdit from '@resources/gl_person/PersonEdit.vue';

// gl_person_contact
import GL_PersonContactList from '@resources/gl_person_contact/PersonContactList.vue';
import GL_PersonContactEdit from '@resources/gl_person_contact/PersonContactEdit.vue';

// gl_field
import GL_FieldList from '@resources/gl_field/FieldList.vue';
import GL_FieldEdit from '@resources/gl_field/FieldEdit.vue';

// gl_field_item
import GL_FieldItemList from '@resources/gl_field_item/FieldItemList.vue';
import GL_FieldItemEdit from '@resources/gl_field_item/FieldItemEdit.vue';

// gl_unit
import GL_UnitList from '@resources/gl_unit/UnitList.vue';
import GL_UnitEdit from '@resources/gl_unit/UnitEdit.vue';

// gl_product
import GL_ProductList from '@resources/gl_product/ProductList.vue';
import GL_ProductEdit from '@resources/gl_product/ProductEdit.vue';

// gl_state_region
import GL_StateRegionList from '@resources/gl_state_region/StateRegionList.vue';
import GL_StateRegionEdit from '@resources/gl_state_region/StateRegionEdit.vue';

// or_order
import OR_OrderList from '@resources/or_order/OrderList.vue';
import OR_OrderEdit from '@resources/or_order/OrderEdit.vue';

// or_order_consolidated
import OR_OrderConsolidatedList from '@resources/or_order_consolidated/OrderConsolidatedList.vue';

// gl_person_type
import GL_PersonTypeList from '../../components/resources/gl_person_type/PersonTypeList.vue';
import GL_PersonTypeEdit from '../../components/resources/gl_person_type/PersonTypeEdit.vue';

// gl_form_contact
import GL_FormContactList from '../../components/resources/gl_form_contact/FormContactList.vue';
import GL_FormContactEdit from '../../components/resources/gl_form_contact/FormContactEdit.vue';

// or_order_category
import OR_OrderCategoryList from '../../components/resources/or_order_category/OrderCategoryList.vue';
import OR_OrderCategoryEdit from '../../components/resources/or_order_category/OrderCategoryEdit.vue';

// sy_config
import SY_ConfigList from '../../components/resources/sy_config/ConfigList.vue';
import SY_ConfigEdit from '../../components/resources/sy_config/ConfigEdit.vue';

// generator-inject-new-file-here
// maintenance
import Man_Container from '../../components/admin/maintenance/Container.vue';
import Man_Menu from '../../components/admin/maintenance/Menu.vue';
import Man_General from '../../components/admin/maintenance/General.vue';
import Man_ConfigFileEdit from '../../components/admin/maintenance/EditConfigFile.vue';
import Man_ImportData from '../../components/admin/maintenance/ImportData.vue';
import Man_RunSql from '../../components/admin/maintenance/RunSql.vue';

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
  // gl_user
  {
    path: '/gl_user',
    components: { default: GL_UserList, header: Header, footer: Footer },
    name: 'gl_user.index',
  },
  {
    path: '/gl_user/:id/edit',
    components: { default: GL_UserEdit, header: Header, footer: Footer },
    name: 'gl_user.edit',
  },
  {
    path: '/gl_user/create',
    components: { default: GL_UserEdit, header: Header, footer: Footer },
    name: 'gl_user.create',
  },
  // gl_country
  {
    path: '/gl_country',
    components: { default: GL_CountryList, header: Header, footer: Footer },
    name: 'gl_country.index',
  },
  {
    path: '/gl_country/:id/edit',
    components: { default: GL_CountryEdit, header: Header, footer: Footer },
    name: 'gl_country.edit',
  },
  {
    path: '/gl_country/create',
    components: { default: GL_CountryEdit, header: Header, footer: Footer },
    name: 'gl_country.create',
  },
  // gl_state
  {
    path: '/gl_state',
    components: { default: GL_StateList, header: Header, footer: Footer },
    name: 'gl_state.index',
  },
  {
    path: '/gl_state/:id/edit',
    components: { default: GL_StateEdit, header: Header, footer: Footer },
    name: 'gl_state.edit',
  },
  {
    path: '/gl_state/create',
    components: { default: GL_StateEdit, header: Header, footer: Footer },
    name: 'gl_state.create',
  },
  // gl_city
  {
    path: '/gl_city',
    components: { default: GL_CityList, header: Header, footer: Footer },
    name: 'gl_city.index',
  },
  {
    path: '/gl_city/:id/edit',
    components: { default: GL_CityEdit, header: Header, footer: Footer },
    name: 'gl_city.edit',
  },
  {
    path: '/gl_city/create',
    components: { default: GL_CityEdit, header: Header, footer: Footer },
    name: 'gl_city.create',
  },
  // gl_person
  {
    path: '/gl_person',
    components: { default: GL_PersonList, header: Header, footer: Footer },
    name: 'gl_person.index',
  },
  {
    path: '/gl_person/:id/edit',
    components: { default: GL_PersonEdit, header: Header, footer: Footer },
    name: 'gl_person.edit',
  },
  {
    path: '/gl_person/create',
    components: { default: GL_PersonEdit, header: Header, footer: Footer },
    name: 'gl_person.create',
  },
  // gl_person_contact
  {
    path: '/gl_person_contact/:origin/:parentEntityId',
    components: {
      default: GL_PersonContactList,
      header: Header,
      footer: Footer,
    },
    name: 'gl_person_contact.index',
  },
  {
    path: '/gl_person_contact/:origin/:parentEntityId/:id/edit',
    components: {
      default: GL_PersonContactEdit,
      header: Header,
      footer: Footer,
    },
    name: 'gl_person_contact.edit',
  },
  {
    path: '/gl_person_contact/:origin/:parentEntityId/create',
    components: {
      default: GL_PersonContactEdit,
      header: Header,
      footer: Footer,
    },
    name: 'gl_person_contact.create',
  },
  // gl_field
  {
    path: '/gl_field',
    components: { default: GL_FieldList, header: Header, footer: Footer },
    name: 'gl_field.index',
  },
  {
    path: '/gl_field/:id/edit',
    components: { default: GL_FieldEdit, header: Header, footer: Footer },
    name: 'gl_field.edit',
  },
  {
    path: '/gl_field/create',
    components: { default: GL_FieldEdit, header: Header, footer: Footer },
    name: 'gl_field.create',
  },
  // gl_field_item
  {
    path: '/gl_field/:parentEntityId/item',
    components: { default: GL_FieldItemList, header: Header, footer: Footer },
    name: 'gl_field_item.index',
  },
  {
    path: '/gl_field/:parentEntityId/item/:id/edit',
    components: { default: GL_FieldItemEdit, header: Header, footer: Footer },
    name: 'gl_field_item.edit',
  },
  {
    path: '/gl_field/:parentEntityId/item/create',
    components: { default: GL_FieldItemEdit, header: Header, footer: Footer },
    name: 'gl_field_item.create',
  },
  // gl_unit
  {
    path: '/gl_unit',
    components: { default: GL_UnitList, header: Header, footer: Footer },
    name: 'gl_unit.index',
  },
  {
    path: '/gl_unit/:id/edit',
    components: { default: GL_UnitEdit, header: Header, footer: Footer },
    name: 'gl_unit.edit',
  },
  {
    path: '/gl_unit/create',
    components: { default: GL_UnitEdit, header: Header, footer: Footer },
    name: 'gl_unit.create',
  },
  // gl_product
  {
    path: '/gl_product',
    components: { default: GL_ProductList, header: Header, footer: Footer },
    name: 'gl_product.index',
  },
  {
    path: '/gl_product/:id/edit',
    components: { default: GL_ProductEdit, header: Header, footer: Footer },
    name: 'gl_product.edit',
  },
  {
    path: '/gl_product/create',
    components: { default: GL_ProductEdit, header: Header, footer: Footer },
    name: 'gl_product.create',
  },
  // gl_state_region
  {
    path: '/gl_state/:parentEntityId/region/:type',
    components: { default: GL_StateRegionList, header: Header, footer: Footer },
    name: 'gl_state_region.index',
  },
  {
    path: '/gl_state/:parentEntityId/region/:type/:id/edit',
    components: { default: GL_StateRegionEdit, header: Header, footer: Footer },
    name: 'gl_state_region.edit',
  },
  {
    path: '/gl_state/:parentEntityId/region/:type/create',
    components: { default: GL_StateRegionEdit, header: Header, footer: Footer },
    name: 'gl_state_region.create',
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
  // gl_person_type
  {
    path: '/gl_person_type',
    components: { default: GL_PersonTypeList, header: Header, footer: Footer },
    name: 'gl_person_type.index',
  },
  {
    path: '/gl_person_type/:id/edit',
    components: { default: GL_PersonTypeEdit, header: Header, footer: Footer },
    name: 'gl_person_type.edit',
  },
  {
    path: '/gl_person_type/create',
    components: { default: GL_PersonTypeEdit, header: Header, footer: Footer },
    name: 'gl_person_type.create',
  },
  // gl_form_contact
  {
    path: '/gl_form_contact',
    components: { default: GL_FormContactList, header: Header, footer: Footer },
    name: 'gl_form_contact.index',
  },
  {
    path: '/gl_form_contact/:id/edit',
    components: { default: GL_FormContactEdit, header: Header, footer: Footer },
    name: 'gl_form_contact.edit',
  },
  {
    path: '/gl_form_contact/create',
    components: { default: GL_FormContactEdit, header: Header, footer: Footer },
    name: 'gl_form_contact.create',
  },
  // or_order_category
  {
    path: '/or_order_category',
    components: {
      default: OR_OrderCategoryList,
      header: Header,
      footer: Footer,
    },
    name: 'or_order_category.index',
  },
  {
    path: '/or_order_category/:id/edit',
    components: {
      default: OR_OrderCategoryEdit,
      header: Header,
      footer: Footer,
    },
    name: 'or_order_category.edit',
  },
  {
    path: '/or_order_category/create',
    components: {
      default: OR_OrderCategoryEdit,
      header: Header,
      footer: Footer,
    },
    name: 'or_order_category.create',
  },
  // generator-inject-new-route-here
  {
    // maintenance
    path: '/maintenance',
    components: { default: Man_Container, header: Header, footer: Footer },
    children: [
      { path: '', redirect: { name: 'maintenance.general' } },
      {
        path: 'general',
        components: { menu: Man_Menu, content: Man_General },
        name: 'maintenance.general',
      },
      {
        path: 'importData',
        components: { menu: Man_Menu, content: Man_ImportData },
        name: 'maintenance.importData',
      },
      {
        path: 'config/edit',
        components: { menu: Man_Menu, content: Man_ConfigFileEdit },
        name: 'config.edit',
      },
      {
        path: 'config/sql',
        components: { menu: Man_Menu, content: Man_RunSql },
        name: 'config.sql',
      },
    ],
  },
  // sy_config
  {
    path: '/sy_config',
    components: { default: Man_Container, header: Header, footer: Footer },
    children: [
      {
        name: 'sy_config.index',
        path: '',
        components: { menu: Man_Menu, content: SY_ConfigList },
      },
      {
        name: 'sy_config.edit',
        path: '/sy_config/:id/edit',
        components: { menu: Man_Menu, content: SY_ConfigEdit },
      },
      {
        name: 'sy_config.create',
        path: '/sy_config/create',
        components: { menu: Man_Menu, content: SY_ConfigEdit },
      },
    ],
  },
  // any
  {
    path: '*',
    components: { default: NotFound, header: Header, footer: Footer },
  },
];
