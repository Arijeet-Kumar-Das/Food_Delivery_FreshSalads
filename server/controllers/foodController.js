const pool = require("../config/db");

// Create food item
exports.createFood = async (req, res) => {
  try {
    const { name, description, price, category_id, image_url } = req.body;
    const [result] = await pool.query(
      "INSERT INTO foods (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, category_id, image_url]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: "Failed to create food item" });
  }
};

// Get all food items
exports.getAllFoods = async (req, res) => {
  try {
    const [foods] = await pool.query(`
      SELECT f.*, c.name as category_name 
      FROM foods f
      JOIN categories c ON f.category_id = c.id
      WHERE f.is_active = TRUE
    `);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch food items" });
  }
};

// Update food item
exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, is_active } =
      req.body;
    await pool.query(
      "UPDATE foods SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, is_active = ? WHERE id = ?",
      [name, description, price, category_id, image_url, is_active, id]
    );
    res.json({ message: "Food item updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update food item" });
  }
};

// Delete food item (soft delete)
exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE foods SET is_active = FALSE WHERE id = ?", [id]);
    res.json({ message: "Food item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete food item" });
  }
};
