var express = require("express");
var router = express.Router();
const controller = require("../controller/AddSkill");

router.post("/:id", controller.AddSkill);

module.exports = router;
