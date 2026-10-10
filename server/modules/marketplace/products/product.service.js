const Product = require("./product.model");

// Get all products for the marketplace
const getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

// Get one product by ID
const getProductById = async (productId) => {
  return await Product.findById(productId);
};

// Create a new product owned by a practitioner
const createProduct = async (productData, practitionerId) => {
  return await Product.create({
    ...productData,
    practitionerId,
  });
};

// Update only a practitioner's own product
const updateProduct = async (
  productId,
  practitionerId,
  productData
) => {
  return await Product.findOneAndUpdate(
    {
      _id: productId,
      practitionerId,
    },
    productData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete only a practitioner's own product
const deleteProduct = async (
  productId,
  practitionerId
) => {
  return await Product.findOneAndDelete({
    _id: productId,
    practitionerId,
  });
};

// Get products created by one practitioner
const getPractitionerProducts = async (practitionerId) => {
  return await Product.find({
    practitionerId,
  }).sort({ createdAt: -1 });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPractitionerProducts,
};
