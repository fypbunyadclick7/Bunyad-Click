var express = require("express");
var router = express.Router();
const controller = require("../controller/AddOffer");

router.post("/", controller.AddOffer);

module.exports = router;
