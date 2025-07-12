const pool = require("../config/db");

// DASHBOARD COUNTS
exports.getStats = async (_req, res) => {
  try {
    const [[orders]] = await pool.query("SELECT COUNT(*) as total FROM orders");
    const [[foods]] = await pool.query("SELECT COUNT(*) as total FROM foods");
    const [[categories]] = await pool.query(
      "SELECT COUNT(*) as total FROM categories"
    );
    const [[users]] = await pool.query("SELECT COUNT(*) as total FROM users");

    res.json({
      orders: orders.total,
      foods: foods.total,
      categories: categories.total,
      users: users.total,
    });
  } catch (err) {
    console.error("Admin stats error", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// ORDERS
exports.getOrders = async (req, res) => {
  try {
    let sql = "SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC";
    const params = [];
    if (req.query.limit) {
      sql += " LIMIT ?";
      params.push(Number(req.query.limit));
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Admin list orders error", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    res.json({ success: true });
  } catch (err) {
    console.error("Admin update status error", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

// FOODS CRUD
exports.getFoods = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM foods");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch foods" });
  }
};

exports.createFood = async (req, res) => {
  try {
    const { name, price, category_id, image_url } = req.body;
    const [result] = await pool.query(
      "INSERT INTO foods (name, price, category_id, image_url) VALUES (?, ?, ?, ?)",
      [name, price, category_id, image_url]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create food" });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { name, price, category_id, image_url } = req.body;
    await pool.query(
      "UPDATE foods SET name=?, price=?, category_id=?, image_url=? WHERE id = ?",
      [name, price, category_id, image_url, foodId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update food" });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    await pool.query("DELETE FROM foods WHERE id = ?", [foodId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete food" });
  }
};

// CATEGORIES CRUD
exports.getCategories = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    await pool.query("UPDATE categories SET name=? WHERE id=?", [name, categoryId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update category" });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await pool.query("DELETE FROM categories WHERE id = ?", [categoryId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// USERS
exports.getUsers = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
