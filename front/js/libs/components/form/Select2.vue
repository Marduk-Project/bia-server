<template>
  <select
    :data-uid="_uid"
    :id="elid"
    :disabled="readonly || disabled"
    :name="name"
    :required="required"
    :class="className"
  >
    <option
      v-if="valueIsObject && value && !multiple"
      :value="value.id"
      selected
      >{{ value.text }}</option
    >
    <option
      v-if="!valueIsObject && value && !multiple"
      :value="value"
      selected
      >{{ value }}</option
    >
  </select>
</template>

<script>
import { jq_beforeSend } from '@mixins/axios-auth';
import _ from 'lodash';
import $ from 'jquery';

export default {
  props: [
    'elid',
    'readonly',
    'disabled',
    'name',
    'required',
    'url',
    'value',
    'options',
    'extraparams',
    'placeholder',
    'templateResult',
    'templateSelection',
    'mapResult',
    'className',
    'multiple',
  ],
  data() {
    return {
      s2ok: false,
      fullValue: null,
    };
  },
  watch: {
    value: function (value) {
      this.s2_select(value);
    },
    options: function (options) {
      this.getElement().empty().select2({ data: options });
    },
  },
  computed: {
    valueIsObject() {
      return _.isObject(this.value);
    },
  },
  methods: {
    onOpen(e) {
      this.$emit('onOpen');
    },
    onClose(e) {
      this.$emit('onClose');
    },
    onChange(e) {
      // nao faz nada
    },
    onSelect(e) {
      const selectedValue = e.params.data;
      if (this.multiple) {
        this.fullValue.push(selectedValue);
      } else {
        this.fullValue = e.params.data;
      }
      this.$emit('input', this.fullValue);
      this.$emit('onSelect', selectedValue);
      this.$emit('onChange', this.fullValue);
    },
    onUnselect(e) {
      const unselectedValue = e.params.data;
      if (this.multiple) {
        this.fullValue = this.fullValue.filter(item => {
          return item.id != unselectedValue.id;
        });
      } else {
        this.fullValue = null;
      }
      this.$emit('input', this.fullValue);
      this.$emit('onUnselect', unselectedValue);
      this.$emit('onChange', this.fullValue);
    },
    getElement() {
      return $('select[data-uid="' + this._uid + '"]');
    },
    s2_mount() {
      if (this.s2ok) {
        this.s2_destroy();
      }
      const vm = this;
      const options = {
        placeholder: this.placeholder ? this.placeholder : 'Selecione',
        width: '100%',
        allowClear: true,
        minimumInputLength: 0,
        multiple: this.multiple ? true : false,
      };
      if (this.url) {
        options.ajax = {
          url: this.url,
          delay: 250,
          dataType: 'json',
          cache: true,
          data(params) {
            var queryData = {};
            if (vm.extraparams) {
              for (var key in vm.extraparams) {
                queryData[key] = vm.extraparams[key];
              }
            }
            queryData.q = params.term;
            queryData.p = params.page;
            return queryData;
          },
          processResults(json, page) {
            var resultList = [];
            if (_.isObject(json)) {
              // json antigo
              if (json.status) {
                if (json.status == 200) {
                  if (json.data.lista) {
                    resultList = json.data.lista;
                  } else {
                    resultList = json.data.s2;
                  }
                }
              } else {
                // formato novo
                if (_.isArray(json.data)) {
                  resultList = json.data;
                } else if (json.page) {
                  if (_.isArray(json.page.data)) {
                    resultList = json.page.data;
                  }
                }
              }
            } else if (_.isArray(json)) {
              resultList = json;
            }
            if (_.isFunction(vm.mapResult)) {
              resultList = resultList.map(vm.mapResult);
            }
            return { results: resultList };
          },
          transport(params, success, failure) {
            params.beforeSend = jq_beforeSend;
            var request = $.ajax(params);
            request.then(success);
            request.fail(failure);
            return request;
          },
        };
      } else {
        options.data = this.options;
      }
      // tpls
      if (_.isFunction(this.templateResult)) {
        options.templateResult = this.templateResult;
      }
      if (_.isFunction(this.templateSelection)) {
        options.templateSelection = this.templateSelection;
      }
      var el = this.getElement();
      el.select2(options);
      this.s2_select(this.value);
      // bind
      el.on('change', this.onChange);
      el.on('select2:select', this.onSelect);
      el.on('select2:unselect', this.onUnselect);
      el.on('select2:open', this.onOpen);
      el.on('select2:close', this.onClose);
      this.s2ok = true;
    },
    s2_destroy() {
      this.getElement().select2('destroy');
      this.s2ok = false;
    },
    s2_select(value) {
      if (value) {
        // remote
        this.fullValue = value;
        if (this.url) {
          if (_.isArray(value)) {
            const el = this.getElement();
            el.empty();
            value.forEach(item => {
              if (_.isFunction(this.mapResult)) {
                this.mapResult(item);
              }
              el.append(
                '<option value="' +
                  item.id +
                  '" selected="selected" >' +
                  item.text +
                  '</option>'
              );
            });
            el.trigger('change');
          } else if (_.isObject(value)) {
            if (_.isFunction(this.mapResult)) {
              value = this.mapResult(value);
            }
            this.getElement()
              .empty()
              .append(
                '<option value="' +
                  value.id +
                  '" selected="selected" >' +
                  value.text +
                  '</option>'
              )
              .val(value.id)
              .trigger('change');
          } else {
            this.getElement()
              .empty()
              .append(
                '<option value="' +
                  value +
                  '" selected="selected" >' +
                  value +
                  '</option>'
              )
              .val(value)
              .trigger('change');
          }
        } else {
          this.getElement().val(value).trigger('change');
        }
      } else {
        if (this.multiple) {
          this.fullValue = [];
        } else {
          this.fullValue = null;
        }
        this.getElement().val(this.fullValue).trigger('change');
      }
    },
  },
  mounted() {
    if (this.multiple) {
      this.fullValue = [];
    }
    this.s2_mount();
  },
  destroyed() {
    this.s2_destroy();
  },
};
</script>

<style scoped></style>
