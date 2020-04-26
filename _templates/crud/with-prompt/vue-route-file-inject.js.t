---
inject: true
to: front/js/context/<%= crud_context %>/routes.js
before: generator-inject-new-file-here
skip_if: 'import <%= fullModelCamelNameUpper %>List'
---
// <%= name %>
import <%= fullModelCamelNameUpper %>List from '../../components/resources/<%= name %>/<%= modelCamelNameUpper %>List.vue';
import <%= fullModelCamelNameUpper %>Edit from '../../components/resources/<%= name %>/<%= modelCamelNameUpper %>Edit.vue';