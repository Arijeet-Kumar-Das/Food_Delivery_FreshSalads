const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Invalid token:", err.message);
    res.status(400).json({ error: "Invalid token" });
  }
};
