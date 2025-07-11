const pool = require("../config/db");

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await pool.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query("SELECT id, name FROM categories");

    // Ensure we always return an array, even if empty
    res.json(Array.isArray(categories) ? categories : []);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({
      error: "Failed to fetch categories",
      details: err.message,
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
