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
// Rate a food item
exports.rateFood = async (req, res) => {
  try {
    const { id } = req.params; // food id
    const userId = req.user.userId || req.user.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be 1-5" });
    }

    // Check delivered order contains this food for this user
    const [rows] = await pool.query(
      `SELECT 1 FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ? AND oi.food_id = ? AND o.status IN ('delivered','completed')
       LIMIT 1`,
      [userId, id]
    );
    if (rows.length === 0) {
      return res
        .status(400)
        .json({ error: "You can rate only after delivery" });
    }

    // Insert or update rating
    const [existing] = await pool.query(
      "SELECT id FROM food_ratings WHERE user_id = ? AND food_id = ?",
      [userId, id]
    );
    if (existing.length === 0) {
      await pool.query(
        "INSERT INTO food_ratings (user_id, food_id, rating) VALUES (?,?,?)",
        [userId, id, rating]
      );
    } else {
      await pool.query(
        "UPDATE food_ratings SET rating = ? WHERE id = ?",
        [rating, existing[0].id]
      );
    }

    // Recalculate average
    const [[avgRow]] = await pool.query(
      "SELECT AVG(rating) as avg, COUNT(*) as cnt FROM food_ratings WHERE food_id = ?",
      [id]
    );
    await pool.query(
      "UPDATE foods SET rating_average = ?, rating_count = ? WHERE id = ?",
      [avgRow.avg, avgRow.cnt, id]
    );

    res.json({ ratingAverage: avgRow.avg, ratingCount: avgRow.cnt });
  } catch (err) {
    console.error("Rate food error", err);
    res.status(500).json({ error: "Failed to rate food" });
  }
};

// Get add-ons available for a given food
exports.getFoodAddons = async (req, res) => {
  try {
    const { id } = req.params;
    const [addons] = await pool.query(
      `SELECT a.id, a.name, a.price
       FROM addons a
       JOIN food_addons fa ON fa.addon_id = a.id
       WHERE fa.food_id = ? AND a.is_active = 1`,
      [id]
    );
    res.json(addons);
  } catch (err) {
    console.error("Fetch add-ons error", err);
    res.status(500).json({ error: "Failed to fetch add-ons" });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE foods SET is_active = FALSE WHERE id = ?", [id]);
    res.json({ message: "Food item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete food item" });
  }
};

// Get current user's rating for a food
exports.getUserRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;
    const [[row]] = await pool.query(
      "SELECT rating FROM food_ratings WHERE user_id = ? AND food_id = ?",
      [userId, id]
    );
    res.json({ rating: row ? row.rating : 0 });
  } catch (err) {
    console.error("Get rating error", err);
    res.status(500).json({ error: "Failed to fetch rating" });
  }
};
