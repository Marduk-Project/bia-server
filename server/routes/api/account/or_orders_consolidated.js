const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/account/or_orders_consolidated');
const authMid = require('../../../middlewares/auth-mid');

router.get('/', authMid.userIsLoggedMiddleware, controller.getIndex);

module.exports = router;
