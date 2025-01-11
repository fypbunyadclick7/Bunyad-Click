var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateEducation");

router.put("/:id", controller.UpdateEducation);

module.exports = router;
