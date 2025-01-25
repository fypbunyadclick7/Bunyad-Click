var express = require("express");
var router = express.Router();
const controller = require("../controller/AddSellerProfile");

router.post("/:userId", controller.AddSellerProfile);

module.exports = router;
