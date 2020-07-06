const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/admin', require('./admin/index'));
router.use('/account', require('./account/index'));
router.use('/visitor', require('./visitor/index'));
router.use('/common', require('./common/index'));

module.exports = router;
