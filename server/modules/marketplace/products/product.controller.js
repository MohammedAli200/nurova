const productService = require("./product.service");
const validateProduct = require("./product.validation");

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const validation = validateProduct(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const product = await productService.createProduct(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const validation = validateProduct(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const product = await productService.updateProduct(
      req.params.id,
      req.user.id,
      req.body
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not own this product",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(
      req.params.id,
      req.user.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not own this product",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// GET /api/practitioners/products
const getMyProducts = async (req, res) => {
  try {
    const products =
      await productService.getPractitionerProducts(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch practitioner products",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
