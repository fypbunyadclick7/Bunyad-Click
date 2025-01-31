var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateProjectStatus");

router.put("/:id", controller.UpdateProjectStatus);

module.exports = router;
