var express = require("express");
var router = express.Router();
const controller = require("../controller/GetFilteredSellerJobs");

router.get("/", controller.GetFilteredSellerJobs);

module.exports = router;
