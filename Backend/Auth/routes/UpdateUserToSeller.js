var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateUserToSeller");

router.put("/", controller.UpdateUserToSeller);

module.exports = router;
