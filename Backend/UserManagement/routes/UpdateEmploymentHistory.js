var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateEmploymentHistory");

router.put("/:id", controller.UpdateEmploymentHistory);

module.exports = router;
