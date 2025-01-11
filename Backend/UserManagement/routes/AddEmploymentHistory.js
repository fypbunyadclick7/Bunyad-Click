var express = require("express");
var router = express.Router();
const controller = require("../controller/AddEmploymentHistory");

router.post("/:userId", controller.AddEmploymentHistory);

module.exports = router;
