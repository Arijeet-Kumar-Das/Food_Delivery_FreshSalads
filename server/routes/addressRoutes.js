const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authMiddleware = require("../middlewares/authMiddleware");

// Add new address
router.post("/", authMiddleware.authenticate, addressController.addAddress);

// Get all addresses for the user
router.get("/", authMiddleware.authenticate, addressController.getAddresses);

// Update an existing address (NEW ENDPOINT)
router.put(
  "/:id",
  authMiddleware.authenticate,
  addressController.updateAddress
);

// Set an address as default
router.put(
  "/default/:id",
  authMiddleware.authenticate,
  addressController.setDefaultAddress
);

// Delete an address
router.delete(
  "/:id",
  authMiddleware.authenticate,
  addressController.deleteAddress
);

module.exports = router;
