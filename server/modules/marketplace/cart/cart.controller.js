const cartService = require("./cart.service");
const validateCartItem = require("./cart.validation");

// GET /api/cart/:userId
const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.params.userId);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

// POST /api/cart/:userId/items
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const validation = validateCartItem({
      productId,
      quantity,
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const cart = await cartService.addToCart(
      req.params.userId,
      productId,
      quantity
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    const statusCode =
      error.message === "Product not found" ||
      error.message === "Insufficient product stock"
        ? 400
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/cart/:userId/items/:productId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { userId, productId } = req.params;

    const validation = validateCartItem({
      productId,
      quantity,
    });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const cart = await cartService.updateCartItem(
      userId,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    const notFoundErrors = [
      "Cart not found",
      "Product not found",
      "Product not found in cart",
    ];

    const statusCode = notFoundErrors.includes(error.message)
      ? 404
      : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/cart/:userId/items/:productId
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await cartService.removeFromCart(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    const statusCode =
      error.message === "Cart not found" ||
      error.message === "Product not found in cart"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/cart/:userId
const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.params.userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    const statusCode =
      error.message === "Cart not found" ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};