const express = require('express');
const router = express.Router();

const maintenanceRouter = require('./maintenance');
router.use('/maintenance', maintenanceRouter);

const userRouter = require('./gl_user');
router.use('/gl_user', userRouter);

module.exports = router;