var express = require("express");
var router = express.Router();
const controller = require("../controller/ChangeVisibility");

router.put("/:id", controller.ChangeVisibility);

module.exports = router;
