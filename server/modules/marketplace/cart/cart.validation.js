const mongoose = require("mongoose");

const validateCartItem = (item) => {
  const { productId, quantity } = item;

  if (!productId) {
    return {
      valid: false,
      message: "Product ID is required",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return {
      valid: false,
      message: "Invalid product ID",
    };
  }

  if (!quantity || quantity < 1) {
    return {
      valid: false,
      message: "Quantity must be at least 1",
    };
  }

  return {
    valid: true,
    message: "Cart item is valid",
  };
};

module.exports = validateCartItem;