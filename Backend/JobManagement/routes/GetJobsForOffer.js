var express = require("express");
var router = express.Router();
const controller = require("../controller/GetJobsForOffer");

router.get("/buyer/:buyerId/seller/:sellerId", controller.GetJobsForOffer);

module.exports = router;
