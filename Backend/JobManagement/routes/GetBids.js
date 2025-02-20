var express = require("express");
var router = express.Router();
const controller = require("../controller/GetBids");

router.get("/:userId", controller.GetBids);

module.exports = router;
