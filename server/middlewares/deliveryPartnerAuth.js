const jwt = require('jsonwebtoken');
const db = require('../config/db');

const deliveryPartnerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'delivery_partner') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    const [rows] = await db.execute('SELECT * FROM delivery_partners WHERE id = ? AND is_active = 1', [decoded.id]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Partner not found or inactive' });
    }
    req.user = { id: decoded.id, phone: decoded.phone, type: 'delivery_partner' };
    next();
  } catch (err) {
    console.error('Partner auth error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = deliveryPartnerAuth;
