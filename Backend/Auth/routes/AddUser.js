var express = require("express");
var router = express.Router();
const controller = require("../controller/AddUser");

router.post("/", controller.AddUser);

module.exports = router;
