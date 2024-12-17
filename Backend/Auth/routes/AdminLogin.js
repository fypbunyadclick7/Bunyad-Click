var express = require("express");
var router = express.Router();
const controller = require("../controller/AdminLogin");

router.post("/", controller.AdminLogin);

module.exports = router;
