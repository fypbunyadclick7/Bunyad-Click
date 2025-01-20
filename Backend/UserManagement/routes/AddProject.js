var express = require("express");
var router = express.Router();
const controller = require("../controller/AddProject");

router.post("/:userId", controller.AddProject);

module.exports = router;
