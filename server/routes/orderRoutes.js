// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// Existing order routes
router.post("/", authMiddleware.authenticate, orderController.createOrder);
router.get(
  "/user/:userId",
  authMiddleware.authenticate,
  orderController.getUserOrders
);
router.get(
  "/:orderId",
  authMiddleware.authenticate,
  orderController.getOrderDetails
);

module.exports = router;
