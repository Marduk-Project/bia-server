---
inject: true
to: _templates_compiled/routes_index.js
before: generator-inject-new-here
skip_if: "'/<%= name %>'"
---
router.use('/<%= name %>', require('./<%= name %>'));
