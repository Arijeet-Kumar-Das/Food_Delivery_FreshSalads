const db = require('../config/db');

/**
 * Assigns an available delivery partner to the given order.
 * 1. Finds the first active and not busy partner (ordered by least deliveries).
 * 2. Marks the partner busy.
 * 3. Updates order with partner id & sets status to 'on_the_way'.
 * 4. Logs assignment in order_delivery_logs.
 * Returns the assigned partner row or null if none available.
 */
const assignDeliveryPartnerToOrder = async (connection, orderId) => {
  // Search for available partner
  const [partners] = await connection.query(
    `SELECT dp.*
       FROM delivery_partners dp
       LEFT JOIN (
           SELECT delivery_partner_id, COUNT(*) as deliveries
           FROM orders
           WHERE delivery_partner_id IS NOT NULL
           GROUP BY delivery_partner_id
       ) od_count ON od_count.delivery_partner_id = dp.id
       WHERE dp.is_active = 1 AND dp.is_busy = 0
       ORDER BY deliveries ASC, dp.created_at ASC
       LIMIT 1`
  );

  if (partners.length === 0) return null;

  const partner = partners[0];

  // Mark partner busy and update order atomically
  await connection.query('UPDATE delivery_partners SET is_busy = 1 WHERE id = ?', [partner.id]);
  await connection.query(
    'UPDATE orders SET delivery_partner_id = ?, status = ? WHERE id = ?',
    [partner.id, 'on_the_way', orderId]
  );
  await connection.query(
    'INSERT INTO order_delivery_logs (order_id, partner_id, status) VALUES (?, ?, ?)',
    [orderId, partner.id, 'assigned']
  );

  return partner;
};

module.exports = {
  assignDeliveryPartnerToOrder
};
