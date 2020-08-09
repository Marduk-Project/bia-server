const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/common/gl_form_contact');
const authMid = require('../../../middlewares/auth-mid');

router.post(
  '/create',
  controller.postPublicContactValidate,
  controller.postPublicContact
);

module.exports = router;
