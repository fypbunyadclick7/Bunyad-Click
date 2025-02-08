var express = require("express");
var router = express.Router();
const controller = require("../controller/GetJob");

router.get("/:jobId", controller.GetJob);

module.exports = router;
