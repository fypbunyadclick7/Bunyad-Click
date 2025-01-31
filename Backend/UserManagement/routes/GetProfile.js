var express = require("express");
var router = express.Router();
const controller = require("../controller/GetProfile");

router.get("/:id", controller.GetProfile);

module.exports = router;
