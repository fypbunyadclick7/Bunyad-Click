var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteSkill");

router.delete("/:id", controller.DeleteSkill);

module.exports = router;
