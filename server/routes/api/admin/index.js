const express = require('express');
const router = express.Router();

router.use('/maintenance', require('./maintenance'));

router.use('/gl_user', require('./gl_user'));
router.use('/gl_person', require('./gl_person'));
router.use('/gl_person_contact', require('./gl_person_contact'));

router.use('/gl_country', require('./gl_country'));
router.use('/gl_state', require('./gl_state'));
router.use('/gl_city', require('./gl_city'));

router.use('/gl_field', require('./gl_field'));
router.use('/gl_field_item', require('./gl_field_item'));

router.use('/gl_unit', require('./gl_unit'));
router.use('/gl_product', require('./gl_product'));

router.use('/gl_state_region', require('./gl_state_region'));

router.use('/or_orders_consolidated', require('./or_orders_consolidated'));

router.use('/gl_person_type', require('./gl_person_type'));

// generator-inject-new-here

module.exports = router;
