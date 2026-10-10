const Cart = require("./cart.model");
const Product = require("../products/product.model");

// Get the user's cart
const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate(
    "items.productId",
    "name price category stock"
  );

  if (!cart) {
    return {
      userId,
      items: [],
    };
  }

  return cart;
};

// Add a product to the cart
const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient product stock");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId.toString()
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (product.stock < newQuantity) {
      throw new Error("Insufficient product stock");
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      productId,
      quantity,
    });
  }

  await cart.save();

  return await Cart.findById(cart._id).populate(
    "items.productId",
    "name price category stock"
  );
};

// Update cart item quantity
const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient product stock");
  }

  const item = cart.items.find(
    (cartItem) => cartItem.productId.toString() === productId.toString()
  );

  if (!item) {
    throw new Error("Product not found in cart");
  }

  item.quantity = quantity;

  await cart.save();

  return await Cart.findById(cart._id).populate(
    "items.productId",
    "name price category stock"
  );
};

// Remove a product from the cart
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const itemExists = cart.items.some(
    (item) => item.productId.toString() === productId.toString()
  );

  if (!itemExists) {
    throw new Error("Product not found in cart");
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  await cart.save();

  return await Cart.findById(cart._id).populate(
    "items.productId",
    "name price category stock"
  );
};

// Clear the entire cart
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];

  await cart.save();

  return cart;
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};