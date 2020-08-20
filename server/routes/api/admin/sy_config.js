const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/admin/sy_config');
const authMid = require('../../../middlewares/auth-mid');

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

router.get(
  '/s/:code',
  controller.getPublicConfigDataValidate,
  controller.getPublicConfigData
);

module.exports = router;
