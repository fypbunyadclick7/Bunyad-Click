var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteEducation");

router.delete("/:id", controller.DeleteEducation);

module.exports = router;
