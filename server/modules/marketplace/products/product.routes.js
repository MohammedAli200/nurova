const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../middleware/authmiddleware");
const roleMiddleware = require("../../../middleware/rolemiddleware");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./product.controller");

// Public marketplace routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Practitioner product management
router.post(
  "/",
  authMiddleware,
  roleMiddleware("practitioner"),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("practitioner"),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("practitioner"),
  deleteProduct
);

module.exports = router;
