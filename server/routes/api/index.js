const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
router.use("/auth", authRouter);

const adminRouter = require("./admin/index");
router.use("/admin", adminRouter);

// const accountRouter = require('./account/index');
// router.use('/account', accountRouter);

module.exports = router;
