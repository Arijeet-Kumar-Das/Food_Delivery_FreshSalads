const pool = require("../config/db");

exports.addAddress = async (req, res) => {
  try {
    const { title, details } = req.body;
    const userId = req.user.userId;

    await pool.query(
      `INSERT INTO addresses (user_id, title, details) 
       VALUES (?, ?, ?)`,
      [userId, title || "Home", details]
    );

    res.status(201).json({ message: "Address added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const [addresses] = await pool.query(
      `SELECT * FROM addresses 
       WHERE user_id = ?`,
      [req.user.userId]
    );
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Reset all defaults
    await pool.query(
      "UPDATE addresses SET is_default = FALSE WHERE user_id = ?",
      [userId]
    );

    // Set new default
    await pool.query(
      "UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    res.json({ message: "Default address updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await pool.query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);

    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
