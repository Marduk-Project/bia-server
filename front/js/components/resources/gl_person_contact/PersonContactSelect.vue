<template>
  <v-select
    :elid="elid"
    :readonly="readonly"
    :disabled="disabled"
    :name="name ? name : 'personContact'"
    :value="value"
    :required="required"
    :options="options"
    :extraparams="extraparams"
    :placeholder="placeholder"
    :mapResult="mapResult"
    :multiple="multiple"
    :id="id"
    :url="options ? null : `/api/${appContext}/gl_person_contact`"
    @onOpen="$emit('onOpen')"
    @onClose="$emit('onClose')"
    @onSelect="$emit('onSelect', $event)"
    @onUnselect="$emit('onUnselect', $event)"
    @input="$emit('input', $event)"
    @onChange="$emit('onChange', $event)"
  ></v-select>
</template>

<script>
  import { mapState } from 'vuex';
  import _ from 'lodash';
  import vSelect from '@libComponents/form/Select2.vue';

  export default {
    props: {
      id: { type: String },
      elid: { type: String },
      name: { type: String },
      url: { type: String },
      value: { type: Object },
      placeholder: { type: String },
      options: { type: Array },
      extraparams: { type: Object },
      readonly: { type: Boolean },
      disabled: { type: Boolean },
      required: { type: Boolean },
      multiple: { type: Boolean },
    },
    components: {
      'v-select': vSelect,
    },
    computed: {
      ...mapState({
        stateContactList: 'personContactList',
        appContext: 'context',
      }),
      personContactList() {
        if (!this.stateContactList) {
          return [];
        }
        if (this.extraparams.personId) {
          return this.stateContactList.filter(
            item => item.person.id == this.extraparams.personId
          );
        }
        return this.stateContactList;
      },
    },
    methods: {
      mapResult(value, index) {
        if (value.shortname) {
          value.text = `${value.shortname} - (${value.name})`;
        } else {
          value.text = `${value.name}`;
        }
        return value;
      },
    },
  };
</script>

<style scoped></style>
