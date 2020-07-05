const express = require('express');
const router = express.Router();

router.use('/or_order_report', require('./or_order_report'));

// generator-inject-new-here

module.exports = router;
