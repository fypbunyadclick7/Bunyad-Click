var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteLanguage");

router.delete("/:id", controller.DeleteLanguage);

module.exports = router;
