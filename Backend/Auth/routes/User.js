var express = require("express");
var router = express.Router();
const controller = require("../controller/User");

router.get("/get", controller.GetUsers);
router.put("/toggle/:id", controller.ToggleStatus);

module.exports = router;
