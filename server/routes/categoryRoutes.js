const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/",
  authMiddleware.authenticate,
  categoryController.createCategory
);
router.get("/", categoryController.getAllCategories);
router.delete(
  "/:id",
  authMiddleware.authenticate,
  categoryController.deleteCategory
);

module.exports = router;
