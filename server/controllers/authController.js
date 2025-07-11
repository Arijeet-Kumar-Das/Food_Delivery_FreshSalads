const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register user (direct SQL in controller)
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password and insert
    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword]
    );

    // Generate JWT token for the new user
    const token = jwt.sign(
      { userId: result.insertId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.insertId,
        name,
        email,
        phone,
      },
      token, // Make sure to include the token!
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Login user (direct SQL)
// Updated login controller in authController.js
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Get user's default address
    const [addresses] = await pool.query(
      `SELECT * FROM addresses 
       WHERE user_id = ? AND is_default = TRUE 
       LIMIT 1`,
      [user[0].id]
    );

    // Generate JWT
    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        defaultAddressId: addresses[0]?.id || null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
