const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/admin/or_order_consolidated');
const authMid = require('../../../middlewares/auth-mid');

// TODO put correct roles
// userIsStaffMiddleware
// userIsAccountMiddleware
// userIsLoggedMiddleware

router.get(
  '/',
  authMid.userIsAdminMiddleware,
  controller.getIndexValidate,
  controller.getIndex
);

router.get(
  '/:id/edit',
  authMid.userIsAdminMiddleware,
  controller.getEditValidate,
  controller.getEdit
);

router.put(
  '/:id',
  authMid.userIsAdminMiddleware,
  controller.putUpdateValidate,
  controller.putUpdate
);

router.post(
  '/',
  authMid.userIsAdminMiddleware,
  controller.postCreateValidate,
  controller.postCreate
);

router.delete(
  '/:id',
  authMid.userIsAdminMiddleware,
  controller.deleteValidate,
  controller.delete
);

module.exports = router;
