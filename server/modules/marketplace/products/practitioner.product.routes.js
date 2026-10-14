const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../middleware/authmiddleware");
const roleMiddleware = require("../../../middleware/rolemiddleware");
const uploadMiddleware = require("../../../middleware/uploadmiddleware");

const {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./product.controller");

router.use(authMiddleware, roleMiddleware("practitioner", "admin"));

// GET /api/practitioner/products - List products owned by authenticated practitioner
router.get("/", getMyProducts);

// POST /api/practitioner/products - Create product
router.post("/", uploadMiddleware.single("image"), createProduct);

// PUT /api/practitioner/products/:id - Update product
router.put("/:id", uploadMiddleware.single("image"), updateProduct);

// DELETE /api/practitioner/products/:id - Delete product
router.delete("/:id", deleteProduct);

module.exports = router;
