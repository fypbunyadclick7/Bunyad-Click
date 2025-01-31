var express = require("express");
var router = express.Router();
const controller = require("../controller/UpdateProfile");

router.put("/:id",controller.UpdateProfile);

module.exports = router;
