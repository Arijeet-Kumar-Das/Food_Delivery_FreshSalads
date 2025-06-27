const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware.authenticate, addressController.addAddress);
router.get("/", authMiddleware.authenticate, addressController.getAddresses);
router.put(
  "/default/:id",
  authMiddleware.authenticate,
  addressController.setDefaultAddress
);
router.delete(
  "/:id",
  authMiddleware.authenticate,
  addressController.deleteAddress
);

module.exports = router;
