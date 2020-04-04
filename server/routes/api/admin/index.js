const express = require('express');
const router = express.Router();

// === admin
const maintenanceRouter = require('./maintenance');
router.use('/maintenance', maintenanceRouter);

const userRouter = require('./user');
router.use('/user', userRouter);

const accountRouter = require('./account');
router.use('/account', accountRouter);

const accountUserRouter = require('./account_user');
router.use('/account_user', accountUserRouter);

const authRouter = require('./auth');
router.use('/auth', authRouter);

module.exports = router;
