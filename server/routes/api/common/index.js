const express = require('express');
const router = express.Router();

router.use('/gl_city', require('./gl_city'));
router.use('/gl_state', require('./gl_state'));

// generator-inject-new-here

module.exports = router;
