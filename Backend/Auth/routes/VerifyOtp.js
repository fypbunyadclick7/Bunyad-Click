var express = require("express");
var router = express.Router();
const controller = require("../controller/VerifyOtp");

router.put("/:id", controller.VerifyOtp);

module.exports = router;
