const express = require('express');
const router = express.Router();

router.use('/or_order', require('./or_order'));

router.use('/or_order_consolidated', require('./or_order_consolidated'));

// generator-inject-new-here

module.exports = router;
