var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateLanguage");

router.put("/:id", controller.UpdateLanguage);

module.exports = router;
