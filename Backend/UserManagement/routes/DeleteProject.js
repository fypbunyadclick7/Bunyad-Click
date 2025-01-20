var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteProject");

router.delete("/:id", controller.DeleteProject);

module.exports = router;
