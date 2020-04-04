const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/auth');
const authMid = require('../../../middlewares/auth-mid');

router.post('/setAccount',
  authMid.userIsManagerMiddleware,
  controller.postAdminSetAccountValidate,
  controller.postAdminSetAccount
);

module.exports = router;
