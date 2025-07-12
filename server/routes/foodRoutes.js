const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware.authenticate, foodController.createFood);
router.get("/", foodController.getAllFoods);
router.put("/:id", authMiddleware.authenticate, foodController.updateFood);
router.post("/:id/rate", authMiddleware.authenticate, foodController.rateFood);
router.get("/:id/rating", authMiddleware.authenticate, foodController.getUserRating);
router.put("/:id", authMiddleware.authenticate, foodController.updateFood);
router.delete("/:id", authMiddleware.authenticate, foodController.deleteFood);

module.exports = router;
