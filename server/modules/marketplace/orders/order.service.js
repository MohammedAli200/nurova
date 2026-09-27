const Order = require("./order.model");
const Product = require("../products/product.model");

// Create a new order
const createOrder = async (userId, productId, quantity) => {
  // Atomically check stock and decrease it.
  // This prevents two orders from buying the same stock simultaneously.
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      stock: { $gte: quantity },
    },
    {
      $inc: { stock: -quantity },
    },
    {
      new: true,
    }
  );
 

  // Product does not exist
  if (!product) {
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Product exists but doesn't have enough stock
    throw new Error("Insufficient product stock");
  }
  
 console.log("STOCK AFTER ORDER:", product.stock);
  // Calculate order total using the price at the time of purchase
  const totalAmount = product.price * quantity;

  try {
    // Create the order
    const order = await Order.create({
      userId,
      productId,
      quantity,
      totalAmount,
    });

    // Return the order with product information
    return await Order.findById(order._id).populate(
      "productId",
      "name description price category stock"
    );
  } catch (error) {
    // If creating the order fails after stock was decreased,
    // restore the stock.
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: quantity },
    });

    throw error;
  }
};

// Get all orders for a user
const getUserOrders = async (userId) => {
  return await Order.find({ userId })
    .populate(
      "productId",
      "name description price category stock"
    )
    .sort({ orderDate: -1 });
};

// Get one order
const getOrderById = async (orderId) => {
  return await Order.findById(orderId).populate(
    "productId",
    "name description price category stock"
  );
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  ).populate(
    "productId",
    "name description price category stock"
  );

  return order;
};

// Cancel an order
const cancelOrder = async (orderId) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: "cancelled" },
    {
      new: true,
      runValidators: true,
    }
  ).populate(
    "productId",
    "name description price category stock"
  );

  return order;
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};