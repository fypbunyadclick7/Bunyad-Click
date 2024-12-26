var express = require("express");
var router = express.Router();
const controller = require("../controller/ToggleAdminStatus");

router.put("/:id", controller.ToggleAdminStatus);

module.exports = router;
