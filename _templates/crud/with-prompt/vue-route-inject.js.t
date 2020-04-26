---
inject: true
to: front/js/context/<%= crud_context %>/routes.js
before: generator-inject-new-route-here
skip_if: "'/<%= name %>'"
---
  // <%= name %>
<% if (crud_parentName) { -%>
  , { path: '/<%= name %>/:parentEntityId', components: { default: <%= fullModelCamelNameUpper %>List, header: Header, footer: Footer }, name: '<%= name %>.index' }
  , { path: '/<%= name %>/:parentEntityId/:id/edit', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.edit' }
  , { path: '/<%= name %>/:parentEntityId/create', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.create' }<% } else { -%>
  , { path: '/<%= name %>', components: { default: <%= fullModelCamelNameUpper %>List, header: Header, footer: Footer }, name: '<%= name %>.index' }
  , { path: '/<%= name %>/:id/edit', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.edit' }
  , { path: '/<%= name %>/create', components: { default: <%= fullModelCamelNameUpper %>Edit, header: Header, footer: Footer }, name: '<%= name %>.create' }<% } -%>