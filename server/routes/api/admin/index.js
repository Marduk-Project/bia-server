const express = require('express');
const router = express.Router();

router.use('/maintenance', require('./maintenance'));

router.use('/gl_user', require('./gl_user'));
router.use('/gl_person', require('./gl_person'));
router.use('/gl_person_contact', require('./gl_person_contact'));

router.use('/gl_country', require('./gl_country'));
router.use('/gl_state', require('./gl_state'));
router.use('/gl_city', require('./gl_city'));

// generator-inject-new-here

module.exports = router;