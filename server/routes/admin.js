const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin/index");
const authMid = require("../middlewares/auth-mid");

router.get("/", authMid.userIsStaffMiddleware, controller.getIndex);

module.exports = router;
