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
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special admin shortcut BEFORE normal auth logic
    if (email === "admin@gmail.com" && password === "admin123") {
      try {
        // ensure admin user exists (insert once)
        let [adminRow] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (adminRow.length === 0) {
          const hashed = await bcrypt.hash(password, 12);
          const [ins] = await pool.query(
            "INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)",
            ["Admin", email, "0000000000", hashed]
          );
          adminRow = [{ id: ins.insertId, name: "Admin", email }];
        }
        const adminUser = adminRow[0];
        const token = jwt.sign(
          { userId: adminUser.id, email: adminUser.email, isAdmin: true },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return res.json({
          token,
          user: {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            defaultAddressId: null,
            isAdmin: true,
          },
        });
      } catch (err) {
        console.error("Admin login error", err);
        return res.status(500).json({ error: "Server error" });
      }
    }

    // ---------------- Normal user flow -----------------
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

        // Determine if admin based on hardcoded credentials
    const currentUser = user[0];
    const isAdmin = false;

    // Get user's default address
    const [addresses] = await pool.query(
      `SELECT * FROM addresses 
       WHERE user_id = ? AND is_default = TRUE 
       LIMIT 1`,
      [user[0].id]
    );

    // Generate JWT
    const token = jwt.sign(
      { userId: currentUser.id, email: currentUser.email, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        defaultAddressId: addresses[0]?.id || null,
        isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
