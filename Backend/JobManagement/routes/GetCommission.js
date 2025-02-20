var express = require("express");
var router = express.Router();
const controller = require("../controller/GetCommission");

router.get("/:role", controller.GetCommission);

module.exports = router;
