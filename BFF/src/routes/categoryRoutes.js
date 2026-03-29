const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, categoryController.getCategories);
router.get("/:id", authenticate, categoryController.getCategoryById);
router.post("/", authenticate, categoryController.createCategory);
router.put("/:id", authenticate, categoryController.updateCategory);

module.exports = router;