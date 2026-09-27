const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("./cart.controller");

// Get user's cart
router.get("/:userId", getCart);

// Add product to cart
router.post("/:userId/items", addToCart);

// Update product quantity
router.put("/:userId/items/:productId", updateCartItem);

// Remove product from cart
router.delete("/:userId/items/:productId", removeFromCart);

// Clear cart
router.delete("/:userId", clearCart);

module.exports = router;