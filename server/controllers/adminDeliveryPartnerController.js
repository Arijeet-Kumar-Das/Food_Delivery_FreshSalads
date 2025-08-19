const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all delivery partners
const getAllDeliveryPartners = async (req, res) => {
  try {
    const [partners] = await db.execute(`
      SELECT 
        id, 
        name, 
        phone, 
        is_active, 
        is_busy, 
        created_at,
        (SELECT COUNT(*) FROM orders WHERE delivery_partner_id = delivery_partners.id) as total_deliveries
      FROM delivery_partners 
      ORDER BY created_at DESC
    `);

    res.json(partners);
  } catch (error) {
    console.error('Get delivery partners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new delivery partner
const createDeliveryPartner = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone, and password are required' });
    }

    // Check if phone already exists
    const [existing] = await db.execute(
      'SELECT id FROM delivery_partners WHERE phone = ?',
      [phone]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Hash password using SHA2 (matching your SQL setup)
    const [result] = await db.execute(
      'INSERT INTO delivery_partners (name, phone, password_hash) VALUES (?, ?, ?)',
      [name, phone, await bcrypt.hash(password,10)]
    );

    res.status(201).json({
      message: 'Delivery partner created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create delivery partner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update delivery partner
const updateDeliveryPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, password, is_active } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    // Check if phone already exists for other partners
    const [existing] = await db.execute(
      'SELECT id FROM delivery_partners WHERE phone = ? AND id != ?',
      [phone, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    let query = 'UPDATE delivery_partners SET name = ?, phone = ?, is_active = ? WHERE id = ?';
    let params = [name, phone, is_active ? 1 : 0, id];

    // If password is provided, update it too
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE delivery_partners SET name = ?, phone = ?, password_hash = ?, is_active = ? WHERE id = ?';
      params = [name, phone, hashedPassword, is_active ? 1 : 0, id];
    }

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Delivery partner not found' });
    }

    res.json({ message: 'Delivery partner updated successfully' });
  } catch (error) {
    console.error('Update delivery partner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete delivery partner
const deleteDeliveryPartner = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if partner has active orders
    const [activeOrders] = await db.execute(
      'SELECT COUNT(*) as count FROM orders WHERE delivery_partner_id = ? AND status != "delivered"',
      [id]
    );

    if (activeOrders[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete delivery partner with active orders' 
      });
    }

    const [result] = await db.execute(
      'DELETE FROM delivery_partners WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Delivery partner not found' });
    }

    res.json({ message: 'Delivery partner deleted successfully' });
  } catch (error) {
    console.error('Delete delivery partner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get delivery partner statistics
const getDeliveryPartnerStats = async (req, res) => {
  try {
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_partners,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_partners,
        SUM(CASE WHEN is_busy = 1 THEN 1 ELSE 0 END) as busy_partners,
        SUM(CASE WHEN is_active = 1 AND is_busy = 0 THEN 1 ELSE 0 END) as available_partners
      FROM delivery_partners
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error('Get delivery partner stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllDeliveryPartners,
  createDeliveryPartner,
  updateDeliveryPartner,
  deleteDeliveryPartner,
  getDeliveryPartnerStats
};
