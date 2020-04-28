---
inject: true
to: "<%= make.expressRoutes ? (inTestMode ? '_templates_compiled/tst_expressRoutesIndex.js' : `server/routes/api/${crud_context}/index.js`) : null %>"
before: generator-inject-new-here
skip_if: "\"/<%= name %>\""
---
router.use('/<%= name %>', require('./<%= name %>'));
