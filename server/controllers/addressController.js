const pool = require("../config/db");

// In your addAddress controller
exports.addAddress = async (req, res) => {
  try {
    const { title, details, is_default } = req.body;
    const userId = req.user.userId;

    // If this is being set as default, first reset any existing defaults
    if (is_default) {
      await pool.query(
        "UPDATE addresses SET is_default = FALSE WHERE user_id = ?",
        [userId]
      );
    }

    // Insert new address
    await pool.query(
      `INSERT INTO addresses (user_id, title, details, is_default) 
       VALUES (?, ?, ?, ?)`,
      [userId, title || "Home", details, is_default || false]
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

    // Verify address belongs to user first
    const [address] = await pool.query(
      "SELECT * FROM addresses WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (!address.length) {
      return res.status(404).json({ error: "Address not found" });
    }

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

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title, details, is_default } = req.body;

    // 1. Check if address exists and belongs to the user
    const [address] = await pool.query(
      "SELECT * FROM addresses WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (!address.length) {
      return res.status(404).json({ error: "Address not found" });
    }

    // 2. If setting as default, reset existing defaults
    if (is_default) {
      await pool.query(
        "UPDATE addresses SET is_default = FALSE WHERE user_id = ?",
        [userId]
      );
    }

    // 3. Update the address
    await pool.query(
      `UPDATE addresses 
       SET title = ?, details = ?, is_default = ?
       WHERE id = ? AND user_id = ?`,
      [
        title || address[0].title, // Keep existing title if not provided
        details || address[0].details, // Keep existing details if not provided
        is_default !== undefined ? is_default : address[0].is_default, // Handle undefined is_default
        id,
        userId,
      ]
    );

    res.json({ message: "Address updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
