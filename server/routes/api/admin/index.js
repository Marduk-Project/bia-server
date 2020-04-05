const express = require('express');
const router = express.Router();

const maintenanceRouter = require('./maintenance');
router.use('/maintenance', maintenanceRouter);

const userRouter = require('./user');
router.use('/user', userRouter);

module.exports = router;