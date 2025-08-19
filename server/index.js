require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const supportRoutes = require("./routes/supportRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const deliveryPartnerRoutes = require("./routes/deliveryPartnerRoutes");

// Import order controller for payment routes
const orderController = require("./controllers/orderController");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use(express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery", deliveryPartnerRoutes);

// Razorpay payment routes (matching your frontend API calls)
app.post(
  "/api/create-razorpay-order",
  authMiddleware.authenticate,
  orderController.createRazorpayOrder
);
app.post(
  "/api/verify-payment",
  authMiddleware.authenticate,
  orderController.verifyPayment
);
app.put(
  "/api/update-order-status",
  authMiddleware.authenticate,
  orderController.updateOrderStatus
);
app.get(
  "/api/payment/:paymentId",
  authMiddleware.authenticate,
  orderController.getPaymentDetails
);

app.get("/api/test-setup", (req, res) => {
  res.json({
    razorpay_configured: !!(
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ),
    key_id: process.env.RAZORPAY_KEY_ID ? "Set" : "Missing",
    key_secret: process.env.RAZORPAY_KEY_SECRET ? "Set" : "Missing",
  });
});
// Test route
app.get("/", (req, res) => {
  res.send("Food Delivery API 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
