var express = require("express");
var router = express.Router();
const controller = require("../controller/GetOffer");

router.get("/:id", controller.GetOffer);

module.exports = router;
