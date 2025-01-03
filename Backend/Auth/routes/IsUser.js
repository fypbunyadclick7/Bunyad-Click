var express = require("express");
var router = express.Router();
const controller = require("../controller/IsUser");

router.get("/:id", controller.IsUser);

module.exports = router;
