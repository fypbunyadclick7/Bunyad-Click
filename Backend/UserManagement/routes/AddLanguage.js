var express = require("express");
var router = express.Router();
const controller = require("../controller/AddLanguage");

router.post("/:userId", controller.AddLanguage);

module.exports = router;
