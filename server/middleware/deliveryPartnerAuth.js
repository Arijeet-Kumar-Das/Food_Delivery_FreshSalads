const jwt = require('jsonwebtoken');
const db = require('../config/db');

const deliveryPartnerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify it's a delivery partner token
    if (decoded.type !== 'delivery_partner') {
      return res.status(401).json({ error: 'Access denied. Invalid token type.' });
    }

    // Verify delivery partner still exists and is active
    const [partners] = await db.execute(
      'SELECT * FROM delivery_partners WHERE id = ? AND is_active = 1',
      [decoded.id]
    );

    if (partners.length === 0) {
      return res.status(401).json({ error: 'Access denied. Partner not found or inactive.' });
    }

    req.user = {
      id: decoded.id,
      phone: decoded.phone,
      type: 'delivery_partner'
    };

    next();
  } catch (error) {
    console.error('Delivery partner auth error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = deliveryPartnerAuth;
