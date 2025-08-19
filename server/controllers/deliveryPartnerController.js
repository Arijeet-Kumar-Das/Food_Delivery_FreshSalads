const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Login for delivery partners
const loginDeliveryPartner = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    // Find delivery partner by phone
    const [partners] = await db.execute(
      'SELECT * FROM delivery_partners WHERE phone = ? AND is_active = 1',
      [phone]
    );

    if (partners.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const partner = partners[0];

    // Support both new bcrypt hashes and old SHA2 hashes (for existing partners)
    let validPass = false;

    if (partner.password_hash.startsWith('$2')) {
      // bcrypt hash
      validPass = await bcrypt.compare(password, partner.password_hash);
    } else {
      // legacy SHA2 hash
      const [hashCheck] = await db.execute(
        'SELECT SHA2(?, 256) as hash',
        [password]
      );
      validPass = hashCheck[0].hash === partner.password_hash;

      // Upgrade to bcrypt on successful legacy login
      if (validPass) {
        const newHash = await bcrypt.hash(password, 10);
        await db.execute(
          'UPDATE delivery_partners SET password_hash = ? WHERE id = ?',
          [newHash, partner.id]
        );
      }
    }

    if (!validPass) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: partner.id, 
        phone: partner.phone, 
        type: 'delivery_partner' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      partner: {
        id: partner.id,
        name: partner.name,
        phone: partner.phone,
        is_busy: partner.is_busy
      }
    });
  } catch (error) {
    console.error('Delivery partner login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get assigned orders for delivery partner
const getAssignedOrders = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const [orders] = await db.execute(`
      SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email,
        a.title as address_title,
        a.details as address_details
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN addresses a ON o.delivery_address_id = a.id
      WHERE o.delivery_partner_id = ? 
      ORDER BY o.created_at DESC
    `, [partnerId]);

    // Get order items for each order
    for (let order of orders) {
      const [items] = await db.execute(`
        SELECT 
          oi.*,
          f.name as food_name,
          f.image_url as food_image
        FROM order_items oi
        JOIN foods f ON oi.food_id = f.id
        WHERE oi.order_id = ?
      `, [order.id]);

      // Get addons for each item
      for (let item of items) {
        const [addons] = await db.execute(`
          SELECT 
            oia.*,
            a.name as addon_name
          FROM order_item_addons oia
          JOIN addons a ON oia.addon_id = a.id
          WHERE oia.order_item_id = ?
        `, [item.id]);
        item.addons = addons;
      }
      
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Get assigned orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update order delivery status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const partnerId = req.user.id;

    if (!['on_the_way', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Verify this order is assigned to this partner
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND delivery_partner_id = ?',
      [orderId, partnerId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found or not assigned to you' });
    }

    // Use explicit connection for transaction
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Update order status
      await conn.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
      );

      // If delivered, free up the delivery partner
      if (status === 'delivered') {
        await conn.execute(
          'UPDATE delivery_partners SET is_busy = 0 WHERE id = ?',
          [partnerId]
        );
      }

      // Log the status change
      await conn.execute(
        'INSERT INTO order_delivery_logs (order_id, partner_id, status) VALUES (?, ?, ?)',
        [orderId, partnerId, status]
      );

      await conn.commit();
      res.json({ message: 'Order status updated successfully' });
    } catch (txErr) {
      await conn.rollback();
      throw txErr;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  loginDeliveryPartner,
  getAssignedOrders,
  updateOrderStatus
};
