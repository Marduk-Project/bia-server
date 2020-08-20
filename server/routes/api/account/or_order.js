const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/account/or_order');
const authMid = require('../../../middlewares/auth-mid');

router.get(
  '/',
  authMid.userIsLoggedMiddleware,
  controller.getIndexValidate,
  controller.getIndex
);

router.get(
  '/:id/edit',
  authMid.userIsLoggedMiddleware,
  controller.getEditValidate,
  controller.getEdit
);

router.put(
  '/:id',
  authMid.userIsLoggedMiddleware,
  controller.putUpdateValidate,
  controller.putUpdate
);

router.post(
  '/',
  authMid.userIsLoggedMiddleware,
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
  '/export',
  authMid.userIsLoggedMiddleware,
  controller.getExportValidate,
  controller.getExport
);

router.get(
  '/exportSupply',
  authMid.userIsLoggedMiddleware,
  controller.getExportSupplyValidate,
  controller.getExportSupply
);

module.exports = router;
