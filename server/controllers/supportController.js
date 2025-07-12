const pool = require("../config/db");

/**
 * Create a customer support message.
 * Expects `subject` (optional) and `message` (required) in body.
 * Requires `authMiddleware.authenticate` so `req.user` is available.
 */
exports.createMessage = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    let { subject = "", message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message field is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO support_messages (user_id, subject, message) VALUES (?, ?, ?)",
      [userId, subject, message]
    );

    if (result.affectedRows === 0) {
      throw new Error("Database insert failed");
    }

    res.status(201).json({ success: true, message: "Support request submitted", id: result.insertId });
  } catch (err) {
    console.error("Error creating support message:", err);
    res.status(500).json({ error: "Failed to submit support request" });
  }
};

/**
 * Get all support messages (admin)
 */
exports.getMessages = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, u.name, u.email
       FROM support_messages s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching support messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

/**
 * Delete support message by id (admin)
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const [result] = await pool.query("DELETE FROM support_messages WHERE id = ?", [messageId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting support message:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};
