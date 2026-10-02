const express = require("express");

const router = express.Router();

const authMiddleware = require("../../../middleware/authmiddleware");

const roleMiddleware = require("../../../middleware/rolemiddleware");

const uploadMiddleware = require("../../../middleware/uploadmiddleware");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("./product.controller");

// Public marketplace routes

router.get("/", getAllProducts);

// Practitioner product management
// IMPORTANT: /my-products must come before /:id
router.get(
  "/my-products",
  authMiddleware,
  roleMiddleware("practitioner"),
  getMyProducts
);

router.get("/:id", getProductById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("practitioner"),
  uploadMiddleware.single("image"),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("practitioner"),
  uploadMiddleware.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("practitioner"),
  deleteProduct
);

module.exports = router;