var express = require("express");
var router = express.Router();
const controller = require("../controller/DeleteJob");

router.delete("/:jobId", controller.DeleteJob);

module.exports = router;
