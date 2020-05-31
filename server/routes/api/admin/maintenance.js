const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/admin/maintenance');

// mids
const authMid = require('../../../middlewares/auth-mid');

router.get('/config_get', authMid.userIsAdminMiddleware, controller.getConfig);

router.post(
  '/config_update',
  authMid.userIsAdminMiddleware,
  controller.postConfig
);

router.post(
  '/ibgeCityImport',
  authMid.userIsAdminMiddleware,
  controller.postIbgeImport
);

router.post(
  '/cityRegionImport',
  authMid.userIsAdminMiddleware,
  controller.postCityRegionImport
);

router.post(
  '/productImport',
  authMid.userIsAdminMiddleware,
  controller.postProductImport
);

router.post(
  '/personImport',
  authMid.userIsAdminMiddleware,
  controller.postFileJsonImportValidate,
  controller.postPersonImport
);

router.post(
  '/orderRequestImport',
  authMid.userIsAdminMiddleware,
  controller.postFileJsonImportValidate,
  controller.postOrderRequestImport
);

router.post(
  '/orderSupplyImport',
  authMid.userIsAdminMiddleware,
  controller.postFileJsonImportValidate,
  controller.postOrderSupplyImport
);

module.exports = router;
