var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateJobStatus");

router.put("/:jobId", controller.UpdateJobStatus);

module.exports = router;
