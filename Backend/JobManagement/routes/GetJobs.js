var express = require("express");
var router = express.Router();
const controller = require("../controller/GetJobs");

router.get("/:userId", controller.GetJobs);

module.exports = router;
