var express = require("express");
var router = express.Router();
const controller = require("../controller/GetSellerJob");

router.get("/:jobId", controller.GetSellerJob);

module.exports = router;
