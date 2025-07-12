const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");
const authMiddleware = require("../middlewares/authMiddleware");

// POST /api/support
router.post("/", authMiddleware.authenticate, supportController.createMessage);

module.exports = router;
