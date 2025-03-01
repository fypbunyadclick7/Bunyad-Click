var express = require("express");
var router = express.Router();
const controller = require("../controller/GetCategories");

router.get("/", controller.GetCategories);

module.exports = router;
