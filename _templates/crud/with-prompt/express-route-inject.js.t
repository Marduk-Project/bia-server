---
inject: true
to: server/routes/api/<%= crud_context %>/index.js
before: generator-inject-new-here
skip_if: "'/<%= name %>'"
---
router.use('/<%= name %>', require('./<%= name %>'));
