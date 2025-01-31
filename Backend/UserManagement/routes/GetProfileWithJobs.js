var express = require("express");
var router = express.Router();
const controller = require("../controller/GetProfileWithJobs");

router.get("/:id", controller.GetProfileWithJobs);

module.exports = router;
