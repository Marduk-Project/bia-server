const express = require('express');
const router = express.Router();

router.use('/or_order_report', require('./or_order_report'));
router.use('/gl_form_contact', require('./gl_form_contact'));

// generator-inject-new-here

module.exports = router;
