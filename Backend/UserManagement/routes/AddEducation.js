var express = require("express");
var router = express.Router();
const controller = require("../controller/AddEducation");

router.post("/:userId", controller.AddEducation);

module.exports = router;
