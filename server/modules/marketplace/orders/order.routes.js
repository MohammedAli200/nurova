const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("./order.controller");

// Create a new order
router.post("/", createOrder);

// Get all orders for a user
router.get("/user/:userId", getUserOrders);

// Get one order by ID
router.get("/:id", getOrderById);

// Update order status
router.put("/:id/status", updateOrderStatus);

// Cancel an order
router.put("/:id/cancel", cancelOrder);

module.exports = router;