const Product = require("./product.model");
const resolvePractitioner = require("../../../utils/practitionerResolver");

// Get all products for the marketplace (populated with resolved practitioner identity)
const getAllProducts = async (filter = {}) => {
  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

  return await Promise.all(
    products.map(async (p) => {
      const practitioner = await resolvePractitioner(p.practitionerId);
      return {
        ...p,
        id: p._id,
        practitionerId: practitioner,
        practitioner,
      };
    })
  );
};

// Get one product by ID
const getProductById = async (productId) => {
  const product = await Product.findById(productId).lean();
  if (!product) return null;

  const practitioner = await resolvePractitioner(product.practitionerId);
  return {
    ...product,
    id: product._id,
    practitionerId: practitioner,
    practitioner,
  };
};

// Create a new product owned by a practitioner
const createProduct = async (productData, practitionerId) => {
  const stock = Number(productData.stock) || 0;
  const inStock =
    productData.inStock !== undefined
      ? Boolean(productData.inStock)
      : stock > 0;

  const created = await Product.create({
    ...productData,
    stock,
    inStock,
    practitionerId,
  });

  const raw = await Product.findById(created._id).lean();
  const practitioner = await resolvePractitioner(practitionerId);

  return {
    ...raw,
    id: raw._id,
    practitionerId: practitioner,
    practitioner,
  };
};

// Update only a practitioner's own product (or admin)
const updateProduct = async (
  productId,
  practitionerId,
  productData,
  isAdmin = false
) => {
  const query = isAdmin
    ? { _id: productId }
    : { _id: productId, practitionerId };

  if (productData.stock !== undefined) {
    const stock = Number(productData.stock);
    if (!isNaN(stock)) {
      productData.stock = stock;
      if (productData.inStock === undefined) {
        productData.inStock = stock > 0;
      }
    }
  }

  const updated = await Product.findOneAndUpdate(query, productData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) return null;

  const practitioner = await resolvePractitioner(updated.practitionerId);
  return {
    ...updated,
    id: updated._id,
    practitionerId: practitioner,
    practitioner,
  };
};

// Delete only a practitioner's own product (or admin), subject to order constraints
const deleteProduct = async (
  productId,
  practitionerId,
  isAdmin = false
) => {
  const query = isAdmin
    ? { _id: productId }
    : { _id: productId, practitionerId };

  // Check if product exists and belongs to practitioner
  const product = await Product.findOne(query);
  if (!product) return null;

  // Check if product has active orders that prevent deletion
  const Order = require("../orders/order.model");
  const activeOrder = await Order.exists({
    productId,
    status: { $in: ["pending", "confirmed", "shipped"] },
  });

  if (activeOrder) {
    const error = new Error(
      "Cannot delete this product because it has active or pending orders in fulfillment."
    );
    error.statusCode = 400;
    throw error;
  }

  return await Product.findOneAndDelete(query);
};

// Get products created by one practitioner
const getPractitionerProducts = async (practitionerId) => {
  const products = await Product.find({ practitionerId })
    .sort({ createdAt: -1 })
    .lean();

  return await Promise.all(
    products.map(async (p) => {
      const practitioner = await resolvePractitioner(p.practitionerId);
      return {
        ...p,
        id: p._id,
        practitionerId: practitioner,
        practitioner,
      };
    })
  );
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPractitionerProducts,
};

