const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/account/or_order_consolidated');
const authMid = require('../../../middlewares/auth-mid');

router.get(
  '/export',
  authMid.userIsLoggedMiddleware,
  controller.getValuesValidate,
  controller.getExport
);

router.get(
  '/',
  authMid.userIsLoggedMiddleware,
  controller.getValuesValidate,
  controller.getIndex
);

module.exports = router;
