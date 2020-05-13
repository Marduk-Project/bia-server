const express = require('express');
const router = express.Router();

router.use('/or_order', require('./or_order'));
router.use('/gl_product', require('./gl_product'));
router.use('/gl_person_contact', require('./gl_person_contact'));

router.use('/or_orders_consolidated', require('./or_orders_consolidated'));

// generator-inject-new-here

module.exports = router;
