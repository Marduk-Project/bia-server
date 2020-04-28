---
to: "<%= make.expressRoutes ? (inTestMode ? '_templates_compiled/tst_expressRoute.js' : `server/routes/api/${crud_context}/${name}.js`) : null %>"
---
const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/admin/<%= name %>');
const authMid = require('../../../middlewares/auth-mid');

// TODO put correct roles
// userIsStaffMiddleware
// userIsAccountMiddleware
// userIsLoggedMiddleware

router.get('/',
  authMid.userIsAdminMiddleware,
  controller.getIndexValidate,
  controller.getIndex
);

router.get('/:id/edit',
  authMid.userIsAdminMiddleware,
  controller.getEditValidate,
  controller.getEdit
);

router.put('/:id',
  authMid.userIsAdminMiddleware,
  controller.putUpdateValidate,
  controller.putUpdate
);

router.post('/',
  authMid.userIsAdminMiddleware,
  controller.postCreateValidate,
  controller.postCreate
);

router.delete('/:id',
  authMid.userIsAdminMiddleware,
  controller.deleteValidate,
  controller.delete
);

module.exports = router;
