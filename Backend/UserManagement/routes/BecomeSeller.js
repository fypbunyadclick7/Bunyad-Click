var express = require("express");
var router = express.Router();
const controller = require("../controller/BecomeSeller");

router.post("/", controller.BecomeSeller);

module.exports = router;
