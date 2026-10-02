const mongoose = require("mongoose");

const validateOrder = (order) => {
  const { userId, productId, quantity } = order;

  if (!userId) {
    return {
      valid: false,
      message: "User ID is required",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      valid: false,
      message: "Invalid user ID",
    };
  }

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
    message: "Order data is valid",
  };
};

module.exports = validateOrder;