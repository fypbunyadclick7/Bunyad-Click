var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdatePassword");

router.put("/:id", controller.UpdatePassword);

module.exports = router;
