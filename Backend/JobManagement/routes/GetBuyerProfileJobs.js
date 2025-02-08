var express = require("express");
var router = express.Router();
const controller = require("../controller/GetBuyerProfileJobs");

router.get("/:userId", controller.GetBuyerProfileJobs);

module.exports = router;
