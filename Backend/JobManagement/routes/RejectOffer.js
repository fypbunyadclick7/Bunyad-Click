var express = require("express");
var router = express.Router();
const controller = require("../controller/RejectOffer");

router.put("/:id", controller.RejectOffer);

module.exports = router;
