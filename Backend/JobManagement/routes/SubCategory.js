var express = require("express");
var router = express.Router();
const controller = require("../controller/SubCategory");

router.post("/add", controller.AddSubCategory);
router.put("/update/:id", controller.UpdateSubCategory);
router.put("/toggle/:id", controller.ToggleStatus);

module.exports = router;
