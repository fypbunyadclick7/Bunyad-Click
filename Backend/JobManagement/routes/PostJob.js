var express = require("express");
var router = express.Router();
const controller = require("../controller/PostJob");

router.post("/", controller.PostJob);

module.exports = router;
