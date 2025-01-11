var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteEmploymentHistory");

router.delete("/:id", controller.DeleteEmploymentHistory);

module.exports = router;
