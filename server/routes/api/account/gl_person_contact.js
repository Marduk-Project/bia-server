const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/account/gl_person_contact');
const authMid = require('../../../middlewares/auth-mid');

router.get(
  '/',
  authMid.userIsLoggedMiddleware,
  controller.getIndexValidate,
  controller.getIndex
);

module.exports = router;
