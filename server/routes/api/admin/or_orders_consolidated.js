const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/admin/or_orders_consolidated');
const authMid = require('../../../middlewares/auth-mid');

router.get(
  '/',
  authMid.userIsStaffMiddleware,
  // controller.getIndexValidate,
  controller.getIndex
);

module.exports = router;
