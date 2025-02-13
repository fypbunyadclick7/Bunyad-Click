var express = require("express");
var router = express.Router();
const controller = require("../controller/GetSellerJobs");

router.get("/", controller.GetSellerJobs);

module.exports = router;
