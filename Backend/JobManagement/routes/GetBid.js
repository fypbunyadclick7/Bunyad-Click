var express = require("express");
var router = express.Router();
const controller = require("../controller/GetBid");

router.get("/:userId", controller.GetBid);

module.exports = router;
