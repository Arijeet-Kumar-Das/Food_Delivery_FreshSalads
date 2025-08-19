const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// GET /api/profile - get current user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const [[user]] = await pool.query(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [userId]
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get profile error", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/profile - update name / phone / password(optional)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { name, phone, password } = req.body;

    // Build dynamic set clause
    const fields = [];
    const values = [];
    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (phone) {
      fields.push("phone = ?");
      values.push(phone);
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 12);
      fields.push("password = ?");
      values.push(hashed);
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    values.push(userId);
    await pool.query(`UPDATE users SET ${fields.join(",")} WHERE id = ?`, values);

    const [[updated]] = await pool.query(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [userId]
    );
    res.json(updated);
  } catch (err) {
    console.error("Update profile error", err);
    res.status(500).json({ error: "Server error" });
  }
};
