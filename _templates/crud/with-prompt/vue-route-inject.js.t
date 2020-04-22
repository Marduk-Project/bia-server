---
inject: true
to: _templates_compiled/vue-routes.js
before: generator-inject-new-route-here
skip_if: "'/<%= name %>'"
---
<% if (crud_parentName) { -%>
  // <%= name %>
  , { path: '/<%= name %>', components: { default: <%= fullModelCamelNameUpper %>List, header: Header, footer: Footer }, name: '<%= name %>.index' }
  , { path: '/<%= name %>/:id/edit', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.edit' }
  , { path: '/<%= name %>/create', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.create' }<% } else { -%>
  // <%= name %>
  , { path: '/<%= name %>/:origin/:parentEntityId', components: { default: <%= fullModelCamelNameUpper %>List, header: Header, footer: Footer }, name: '<%= name %>.index' }
  , { path: '/<%= name %>/:origin/:parentEntityId/:id/edit', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.edit' }
  , { path: '/<%= name %>/:origin/:parentEntityId/create', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.create' }<% } -%>