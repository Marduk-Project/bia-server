---
inject: true
to: "<%= make.vueRoutes ? (inTestMode ? '_templates_compiled/tst_vueRoutes.js' : `front/js/context/${crud_context}/routes.js`) : null %>"
before: generator-inject-new-file-here
skip_if: 'import <%= make.vueList ? `${fullModelCamelNameUpper}List` : `${fullModelCamelNameUpper}Edit` %>'
---
// <%= name %>
<% if (make.vueList) { -%>
import <%= fullModelCamelNameUpper %>List from '../../components/resources/<%= name %>/<%= modelCamelNameUpper %>List.vue';
<% } -%><% if (make.vueEdit) { -%>
import <%= fullModelCamelNameUpper %>Edit from '../../components/resources/<%= name %>/<%= modelCamelNameUpper %>Edit.vue';
<% } -%>