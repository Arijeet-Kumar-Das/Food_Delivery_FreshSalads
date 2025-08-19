const express = require('express');
const router = express.Router();
const deliveryCtrl = require('../controllers/deliveryPartnerController');
const partnerAuth = require('../middlewares/deliveryPartnerAuth');

// Public: login
router.post('/login', deliveryCtrl.loginDeliveryPartner);

// Protected: get assigned orders
router.get('/orders', partnerAuth, deliveryCtrl.getAssignedOrders);

// Protected: update delivery status (on_the_way / delivered)
router.put('/orders/:orderId/status', partnerAuth, deliveryCtrl.updateOrderStatus);

module.exports = router;
