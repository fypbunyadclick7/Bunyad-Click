var express = require("express");
var router = express.Router();
const controller = require("../controller/Category");

router.post("/add", controller.AddCategory);
router.put("/update/:id", controller.UpdateCategory);
router.put("/toggle/:id", controller.ToggleStatus);

module.exports = router;
