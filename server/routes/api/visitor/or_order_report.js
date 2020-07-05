const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/visitor/or_order_report');
const authMid = require('../../../middlewares/auth-mid');

router.get(
  '/state/:glStateId/dashboard',
  controller.getStateDashboardReportValidate,
  controller.getStateDashboardReport
);

module.exports = router;
