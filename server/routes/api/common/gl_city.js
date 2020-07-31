const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/common/gl_city');
const authMid = require('../../../middlewares/auth-mid');

router.get('/', controller.getIndexValidate, controller.getIndex);

module.exports = router;
