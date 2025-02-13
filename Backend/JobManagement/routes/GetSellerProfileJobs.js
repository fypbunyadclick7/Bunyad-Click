var express = require("express");
var router = express.Router();
const controller = require("../controller/GetSellerProfileJobs");

router.get("/:userId", controller.GetSellerProfileJobs);

module.exports = router;
