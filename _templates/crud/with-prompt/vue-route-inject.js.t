---
inject: true
to: "<%= make.vueRoutes ? (inTestMode ? '_templates_compiled/tst_vueRoutes.js' : `front/js/context/${crud_context}/routes.js`) : null %>"
before: generator-inject-new-route-here
skip_if: "\"/<%= name %>\""
---
  // <%= name %>
<% if (crud_parentName) { -%>
<% if (make.vueList) { -%>
  { path: '/<%= name %>/:parentEntityId', components: { default: <%= fullModelCamelNameUpper %>List, header: Header, footer: Footer }, name: '<%= name %>.index' },<% } -%>
<% if (make.vueEdit) { -%>
  { path: '/<%= name %>/:parentEntityId/:id/edit', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.edit' },
  { path: '/<%= name %>/:parentEntityId/create', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.create' },<% } -%><% } else { -%>
<% if (make.vueList) { -%>
  { path: '/<%= name %>', components: { default: <%= fullModelCamelNameUpper %>List, header: Header, footer: Footer }, name: '<%= name %>.index' },<% } -%>
<% if (make.vueEdit) { -%>
  { path: '/<%= name %>/:id/edit', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.edit' },
  { path: '/<%= name %>/create', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.create' },<% } -%><% } -%>