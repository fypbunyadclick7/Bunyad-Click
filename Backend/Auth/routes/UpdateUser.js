var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateUser");

router.put("/:id", controller.UpdateUser);

module.exports = router;
