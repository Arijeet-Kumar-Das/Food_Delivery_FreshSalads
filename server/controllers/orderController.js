const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { assignDeliveryPartnerToOrder } = require("../services/deliveryPartnerService");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order for payment
exports.createRazorpayOrder = async (req, res) => {
  try {
    console.log("=== Creating Razorpay Order ===");
    console.log("Request body:", req.body);
    console.log("User from auth:", req.user); // Check if auth is working

    const { amount, orderId } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_${orderId || Date.now()}`,
      payment_capture: 1,
    };

    console.log("Razorpay options:", options);
    const razorpayOrder = await razorpay.orders.create(options);
    console.log("Razorpay order created successfully:", razorpayOrder.id);

    res.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("=== Razorpay Order Creation Error ===");
    console.error("Error details:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create payment order",
      error: error.message, // Add error details
    });
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      order_id, // Your database order ID
    } = req.body;

    // Log all incoming values for debugging
    console.log("Verifying payment with:");
    console.log("razorpay_order_id:", razorpay_order_id);
    console.log("razorpay_payment_id:", razorpay_payment_id);
    console.log("razorpay_signature:", razorpay_signature);
    console.log("DB order_id:", order_id);

    // Create signature for verification using Razorpay's order ID and payment ID
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = require("crypto")
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);

    if (expectedSignature === razorpay_signature) {
      // Payment verified successfully - update order status
      await connection.beginTransaction();

      await connection.query(
        "UPDATE orders SET status = ?, payment_id = ?, payment_status = ? WHERE id = ?",
        ["confirmed", razorpay_payment_id, "completed", order_id]
      );

      // Auto-assign a delivery partner now that payment is successful
      await assignDeliveryPartnerToOrder(connection, order_id);

      await connection.commit();

      res.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });

      console.log("Payment verified for DB order:", order_id);
    } else {
      console.error("Signature mismatch. Payment verification failed.");
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// Create order (Modified to work with payment flow)
exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { user_id, items, delivery_address_id } = req.body;

    // Validate required fields
    if (
      !user_id ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !delivery_address_id
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate total
    let total = 0;
    const foodPrices = await getFoodPrices(connection, items);

    // Collect unique addon ids and fetch their prices
    const uniqueAddonIds = [
      ...new Set(
        items.flatMap((it) => (Array.isArray(it.addons) ? it.addons.map((a) => a.id) : []))
      ),
    ];
    const addonPrices = await getAddonPrices(connection, uniqueAddonIds);

    items.forEach((item) => {
      if (!foodPrices[item.food_id]) {
        throw new Error(`Invalid food_id: ${item.food_id}`);
      }

      const addonsArr = Array.isArray(item.addons) ? item.addons : [];

      // Validate addons & compute addon total
      let addonTotal = 0;
      for (const ad of addonsArr) {
        if (!addonPrices[ad.id]) {
          throw new Error(`Invalid addon_id: ${ad.id}`);
        }
        addonTotal += addonPrices[ad.id];
      }

      total += (foodPrices[item.food_id] + addonTotal) * item.quantity;
    });

    // Create order with status 'pending' and payment_status 'pending'
    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_amount, delivery_address_id, status, payment_status) VALUES (?, ?, ?, ?, ?)",
      [user_id, total, delivery_address_id, "pending", "pending"]
    );
    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      const addonsArr = Array.isArray(item.addons) ? item.addons : [];

      // Validate addons & compute addon total
      let addonTotal = 0;
      for (const ad of addonsArr) {
        if (!addonPrices[ad.id]) {
          throw new Error(`Invalid addon_id: ${ad.id}`);
        }
        addonTotal += addonPrices[ad.id];
      }

      const [oiResult] = await connection.query(
        "INSERT INTO order_items (order_id, food_id, quantity, price_at_order) VALUES (?, ?, ?, ?)",
        [orderId, item.food_id, item.quantity, foodPrices[item.food_id]]
      );
      const orderItemId = oiResult.insertId;

      // Insert chosen addons for this item
      for (const ad of addonsArr) {
        await connection.query(
          "INSERT INTO order_item_addons (order_item_id, addon_id, price) VALUES (?, ?, ?)",
          [orderItemId, ad.id, addonPrices[ad.id]]
        );
      }
    }

    await connection.commit();
    res.status(201).json({
      orderId,
      total,
      message: "Order created successfully. Proceed to payment.",
    });
  } catch (err) {
    await connection.rollback();
    console.error("Order creation error:", err);
    res.status(500).json({ error: err.message || "Failed to create order" });
  } finally {
    connection.release();
  }
};

// Helper function to get current food prices
async function getFoodPrices(connection, items) {
  const foodIds = items.map((item) => item.food_id);
  const [foods] = await connection.query(
    "SELECT id, price FROM foods WHERE id IN (?)",
    [foodIds]
  );

  return foods.reduce((acc, food) => {
    acc[food.id] = Number(food.price);
    return acc;
  }, {});
}

// Helper function to get addon prices (and validate their existence)
async function getAddonPrices(connection, addonIds) {
  if (addonIds.length === 0) return {};
  const [addons] = await connection.query(
    "SELECT id, price FROM addons WHERE id IN (?) AND is_active = 1",
    [addonIds]
  );
  return addons.reduce((acc, addon) => {
    acc[addon.id] = Number(addon.price);
    return acc;
  }, {});
}

// Get payment details (New function)
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      payment: payment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch payment details",
    });
  }
};

// Update order status after payment failure
exports.updateOrderStatus = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { orderId, status, payment_status } = req.body;

    await connection.query(
      "UPDATE orders SET status = ?, payment_status = ? WHERE id = ?",
      [status, payment_status, orderId]
    );

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  } finally {
    connection.release();
  }
};

// Get user orders (keeping your existing function)
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(orders);
  } catch (err) {
    console.error("Fetch user orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get order details (keeping your existing function)
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get order header
    const [order] = await pool.query("SELECT * FROM orders WHERE id = ?", [
      orderId,
    ]);

    if (!order.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Get order items with food details
    const [items] = await pool.query(
      `SELECT oi.*, f.name as food_name, f.image_url \
       FROM order_items oi \
       JOIN foods f ON oi.food_id = f.id \
       WHERE oi.order_id = ?`,
      [orderId]
    );

    if (items.length) {
      const orderItemIds = items.map((it) => it.id);
      const [addonRows] = await pool.query(
        `SELECT oia.order_item_id, a.name, oia.price \
         FROM order_item_addons oia \
         JOIN addons a ON a.id = oia.addon_id \
         WHERE oia.order_item_id IN (?)`,
        [orderItemIds]
      );
      // group addons by order_item_id
      const addonsByItem = {};
      addonRows.forEach((row) => {
        if (!addonsByItem[row.order_item_id]) addonsByItem[row.order_item_id] = [];
        addonsByItem[row.order_item_id].push({ name: row.name, price: row.price });
      });
      // attach to items
      items.forEach((it) => {
        it.addons = addonsByItem[it.id] || [];
      });
    }

    res.json({ ...order[0], items });
  } catch (err) {
    console.error("Fetch order details error:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};
