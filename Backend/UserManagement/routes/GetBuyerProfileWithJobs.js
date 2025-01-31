var express = require("express");
var router = express.Router();
const controller = require("../controller/GetBuyerProfileWithJobs");

router.get("/:id", controller.GetBuyerProfileWithJobs);

module.exports = router;
