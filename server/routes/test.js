const express = require("express");
const router = express.Router();

const controller = require("../controllers/test");

router.get("/test", controller.getTest);

module.exports = router;
