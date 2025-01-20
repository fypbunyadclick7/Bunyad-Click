var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateProject");

router.put("/:id", controller.UpdateProject);

module.exports = router;
