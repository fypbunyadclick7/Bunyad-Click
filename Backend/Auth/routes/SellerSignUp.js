var express = require("express");
var router = express.Router();
const controller = require("../controller/SellerSignUp");

router.post("/", controller.SellerSignUp);

module.exports = router;
