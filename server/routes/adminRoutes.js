const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");
const deliveryPartnerAdmin = require("../controllers/adminDeliveryPartnerController");
const adminMW = require("../middlewares/adminMiddleware");

// Dashboard stats
router.get("/stats", adminMW, admin.getStats);

// Orders
router.get("/orders", adminMW, admin.getOrders);
router.put("/orders/:orderId", adminMW, admin.updateOrderStatus);

// Foods
router.get("/foods", adminMW, admin.getFoods);
router.post("/foods", adminMW, admin.createFood);
router.put("/foods/:foodId", adminMW, admin.updateFood);
router.delete("/foods/:foodId", adminMW, admin.deleteFood);

// Categories
router.get("/categories", adminMW, admin.getCategories);
router.post("/categories", adminMW, admin.createCategory);
router.put("/categories/:categoryId", adminMW, admin.updateCategory);
router.delete("/categories/:categoryId", adminMW, admin.deleteCategory);

// Support messages
const supportCtrl = require("../controllers/supportController");
router.get("/support-messages", adminMW, supportCtrl.getMessages);
router.delete("/support-messages/:messageId", adminMW, supportCtrl.deleteMessage);

// Delivery Partners
router.get("/delivery-partners", adminMW, deliveryPartnerAdmin.getAllDeliveryPartners);
router.get("/delivery-partners/stats", adminMW, deliveryPartnerAdmin.getDeliveryPartnerStats);
router.post("/delivery-partners", adminMW, deliveryPartnerAdmin.createDeliveryPartner);
router.put("/delivery-partners/:id", adminMW, deliveryPartnerAdmin.updateDeliveryPartner);
router.delete("/delivery-partners/:id", adminMW, deliveryPartnerAdmin.deleteDeliveryPartner);

// Users
router.get("/users", adminMW, admin.getUsers);
router.delete("/users/:userId", adminMW, admin.deleteUser);

module.exports = router;
