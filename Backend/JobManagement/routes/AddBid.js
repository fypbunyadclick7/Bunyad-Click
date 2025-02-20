var express = require("express");
var router = express.Router();
const controller = require("../controller/AddBid");

router.post("/", controller.AddBid);

module.exports = router;
