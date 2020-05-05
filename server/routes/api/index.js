const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/admin', require('./admin/index'));
router.use('/account', require('./account/index'));

module.exports = router;
