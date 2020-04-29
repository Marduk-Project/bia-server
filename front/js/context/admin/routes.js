// basics
import Dashboard from "../../components/admin/Dashboard.vue";
import Header from "../../components/admin/Header.vue";
import NotFound from "../../components/common/NotFound.vue";
import Footer from "../../components/common/Footer.vue";
// gl_user
import GL_Profile from "../../components/resources/gl_user/Profile.vue";
import GL_UserList from "../../components/resources/gl_user/UserList.vue";
import GL_UserEdit from "../../components/resources/gl_user/UserEdit.vue";
// gl_country
import GL_CountryList from "../../components/resources/gl_country/CountryList.vue";
import GL_CountryEdit from "../../components/resources/gl_country/CountryEdit.vue";
// gl_state
import GL_StateList from "../../components/resources/gl_state/StateList.vue";
import GL_StateEdit from "../../components/resources/gl_state/StateEdit.vue";
// gl_city
import GL_CityList from "../../components/resources/gl_city/CityList.vue";
import GL_CityEdit from "../../components/resources/gl_city/CityEdit.vue";
// gl_person
import GL_PersonList from "../../components/resources/gl_person/PersonList.vue";
import GL_PersonEdit from "../../components/resources/gl_person/PersonEdit.vue";
// gl_person_contact
import GL_PersonContactList from "../../components/resources/gl_person_contact/PersonContactList.vue";
import GL_PersonContactEdit from "../../components/resources/gl_person_contact/PersonContactEdit.vue";
// gl_field
import GL_FieldList from "../../components/resources/gl_field/FieldList.vue";
import GL_FieldEdit from "../../components/resources/gl_field/FieldEdit.vue";
// gl_field_item
import GL_FieldItemList from "../../components/resources/gl_field_item/FieldItemList.vue";
import GL_FieldItemEdit from "../../components/resources/gl_field_item/FieldItemEdit.vue";
// gl_unit
import GL_UnitList from "../../components/resources/gl_unit/UnitList.vue";
import GL_UnitEdit from "../../components/resources/gl_unit/UnitEdit.vue";
// gl_product
import GL_ProductList from "../../components/resources/gl_product/ProductList.vue";
import GL_ProductEdit from "../../components/resources/gl_product/ProductEdit.vue";
// gl_state_region
import GL_StateRegionList from "../../components/resources/gl_state_region/StateRegionList.vue";
import GL_StateRegionEdit from "../../components/resources/gl_state_region/StateRegionEdit.vue";

// generator-inject-new-file-here
// maintenance
import Man_Container from "../../components/admin/maintenance/Container.vue";
import Man_Menu from "../../components/admin/maintenance/Menu.vue";
import Man_General from "../../components/admin/maintenance/General.vue";
import Man_ConfigFileEdit from "../../components/admin/maintenance/EditConfigFile.vue";

export default [
  { path: "/", redirect: "/dashboard" },
  {
    path: "/dashboard",
    components: { default: Dashboard, header: Header, footer: Footer },
    name: "dashboard",
  },
  {
    path: "/gl_user/profile",
    components: { default: GL_Profile, header: Header, footer: Footer },
    name: "user.profile",
  },
  // gl_user
  {
    path: "/gl_user",
    components: { default: GL_UserList, header: Header, footer: Footer },
    name: "gl_user.index",
  },
  {
    path: "/gl_user/:id/edit",
    components: { default: GL_UserEdit, header: Header, footer: Footer },
    name: "gl_user.edit",
  },
  {
    path: "/gl_user/create",
    components: { default: GL_UserEdit, header: Header, footer: Footer },
    name: "gl_user.create",
  },
  // gl_country
  {
    path: "/gl_country",
    components: { default: GL_CountryList, header: Header, footer: Footer },
    name: "gl_country.index",
  },
  {
    path: "/gl_country/:id/edit",
    components: { default: GL_CountryEdit, header: Header, footer: Footer },
    name: "gl_country.edit",
  },
  {
    path: "/gl_country/create",
    components: { default: GL_CountryEdit, header: Header, footer: Footer },
    name: "gl_country.create",
  },
  // gl_state
  {
    path: "/gl_state",
    components: { default: GL_StateList, header: Header, footer: Footer },
    name: "gl_state.index",
  },
  {
    path: "/gl_state/:id/edit",
    components: { default: GL_StateEdit, header: Header, footer: Footer },
    name: "gl_state.edit",
  },
  {
    path: "/gl_state/create",
    components: { default: GL_StateEdit, header: Header, footer: Footer },
    name: "gl_state.create",
  },
  // gl_city
  {
    path: "/gl_city",
    components: { default: GL_CityList, header: Header, footer: Footer },
    name: "gl_city.index",
  },
  {
    path: "/gl_city/:id/edit",
    components: { default: GL_CityEdit, header: Header, footer: Footer },
    name: "gl_city.edit",
  },
  {
    path: "/gl_city/create",
    components: { default: GL_CityEdit, header: Header, footer: Footer },
    name: "gl_city.create",
  },
  // gl_person
  {
    path: "/gl_person",
    components: { default: GL_PersonList, header: Header, footer: Footer },
    name: "gl_person.index",
  },
  {
    path: "/gl_person/:id/edit",
    components: { default: GL_PersonEdit, header: Header, footer: Footer },
    name: "gl_person.edit",
  },
  {
    path: "/gl_person/create",
    components: { default: GL_PersonEdit, header: Header, footer: Footer },
    name: "gl_person.create",
  },
  // gl_person_contact
  {
    path: "/gl_person_contact/:origin/:parentEntityId",
    components: {
      default: GL_PersonContactList,
      header: Header,
      footer: Footer,
    },
    name: "gl_person_contact.index",
  },
  {
    path: "/gl_person_contact/:origin/:parentEntityId/:id/edit",
    components: {
      default: GL_PersonContactEdit,
      header: Header,
      footer: Footer,
    },
    name: "gl_person_contact.edit",
  },
  {
    path: "/gl_person_contact/:origin/:parentEntityId/create",
    components: {
      default: GL_PersonContactEdit,
      header: Header,
      footer: Footer,
    },
    name: "gl_person_contact.create",
  },
  // gl_field
  {
    path: "/gl_field",
    components: { default: GL_FieldList, header: Header, footer: Footer },
    name: "gl_field.index",
  },
  {
    path: "/gl_field/:id/edit",
    components: { default: GL_FieldEdit, header: Header, footer: Footer },
    name: "gl_field.edit",
  },
  {
    path: "/gl_field/create",
    components: { default: GL_FieldEdit, header: Header, footer: Footer },
    name: "gl_field.create",
  },
  // gl_field_item
  {
    path: "/gl_field/:parentEntityId/item",
    components: { default: GL_FieldItemList, header: Header, footer: Footer },
    name: "gl_field_item.index",
  },
  {
    path: "/gl_field/:parentEntityId/item/:id/edit",
    components: { default: GL_FieldItemEdit, header: Header, footer: Footer },
    name: "gl_field_item.edit",
  },
  {
    path: "/gl_field/:parentEntityId/item/create",
    components: { default: GL_FieldItemEdit, header: Header, footer: Footer },
    name: "gl_field_item.create",
  },
  // gl_unit
  {
    path: "/gl_unit",
    components: { default: GL_UnitList, header: Header, footer: Footer },
    name: "gl_unit.index",
  },
  {
    path: "/gl_unit/:id/edit",
    components: { default: GL_UnitEdit, header: Header, footer: Footer },
    name: "gl_unit.edit",
  },
  {
    path: "/gl_unit/create",
    components: { default: GL_UnitEdit, header: Header, footer: Footer },
    name: "gl_unit.create",
  },
  // gl_product
  {
    path: "/gl_product",
    components: { default: GL_ProductList, header: Header, footer: Footer },
    name: "gl_product.index",
  },
  {
    path: "/gl_product/:id/edit",
    components: { default: GL_ProductEdit, header: Header, footer: Footer },
    name: "gl_product.edit",
  },
  {
    path: "/gl_product/create",
    components: { default: GL_ProductEdit, header: Header, footer: Footer },
    name: "gl_product.create",
  },
  // gl_state_region
  {
    path: "/gl_state/:parentEntityId/region/:type",
    components: { default: GL_StateRegionList, header: Header, footer: Footer },
    name: "gl_state_region.index",
  },
  {
    path: "/gl_state/:parentEntityId/region/:type/:id/edit",
    components: { default: GL_StateRegionEdit, header: Header, footer: Footer },
    name: "gl_state_region.edit",
  },
  {
    path: "/gl_state/:parentEntityId/region/:type/create",
    components: { default: GL_StateRegionEdit, header: Header, footer: Footer },
    name: "gl_state_region.create",
  },
  // generator-inject-new-route-here
  // maintenance
  {
    path: "/maintenance",
    components: { default: Man_Container, header: Header, footer: Footer },
    children: [
      { path: "", redirect: { name: "maintenance.general" } },
      {
        path: "general",
        components: { menu: Man_Menu, content: Man_General },
        name: "maintenance.general",
      },
      {
        path: "config/edit",
        components: { menu: Man_Menu, content: Man_ConfigFileEdit },
        name: "config.edit",
      },
    ],
  },
  // any
  {
    path: "*",
    components: { default: NotFound, header: Header, footer: Footer },
  },
];
