const express = require('express');
const router = express.Router();
const controller = require('../controllers/account/index');
const authMid = require('../middlewares/auth-mid');

router.get('/', authMid.userIsAccountMiddleware, controller.getIndex);

module.exports = router;
