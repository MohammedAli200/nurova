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

    let ingredients = [];
    if (req.body.ingredients) {
      if (Array.isArray(req.body.ingredients)) {
        ingredients = req.body.ingredients;
      } else if (typeof req.body.ingredients === "string") {
        ingredients = req.body.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      }
    }

    let benefits = [];
    if (req.body.benefits) {
      if (Array.isArray(req.body.benefits)) {
        benefits = req.body.benefits;
      } else if (typeof req.body.benefits === "string") {
        benefits = req.body.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean);
      }
    }

    const price = Number(req.body.price);
    const stock = Number(req.body.stock) || 0;
    const inStock = req.body.inStock !== undefined 
      ? req.body.inStock === "true" || req.body.inStock === true
      : stock > 0;

    const productPayload = {
      name: req.body.name.trim(),
      shortDescription: (req.body.shortDescription || "").trim(),
      description: req.body.description.trim(),
      price,
      category: req.body.category.trim(),
      stock,
      inStock,
      brand: (req.body.brand || "").trim(),
      specifications: (req.body.specifications || "").trim(),
      usageInstructions: (req.body.usageInstructions || "").trim(),
      ingredients,
      benefits,
      ...(req.file && {
        image: `/uploads/${req.file.filename}`,
      }),
      ...(!req.file && req.body.image && typeof req.body.image === "string" && {
        image: req.body.image.trim(),
      }),
    };

    const product = await productService.createProduct(productPayload, req.user.id);

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

    let ingredients = undefined;
    if (req.body.ingredients !== undefined) {
      if (Array.isArray(req.body.ingredients)) {
        ingredients = req.body.ingredients;
      } else if (typeof req.body.ingredients === "string") {
        ingredients = req.body.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      }
    }

    let benefits = undefined;
    if (req.body.benefits !== undefined) {
      if (Array.isArray(req.body.benefits)) {
        benefits = req.body.benefits;
      } else if (typeof req.body.benefits === "string") {
        benefits = req.body.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean);
      }
    }

    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const inStock = req.body.inStock !== undefined 
      ? req.body.inStock === "true" || req.body.inStock === true
      : stock > 0;

    const updatePayload = {
      name: req.body.name.trim(),
      shortDescription: (req.body.shortDescription || "").trim(),
      description: req.body.description.trim(),
      price,
      category: req.body.category.trim(),
      stock,
      inStock,
      brand: (req.body.brand || "").trim(),
      specifications: (req.body.specifications || "").trim(),
      usageInstructions: (req.body.usageInstructions || "").trim(),
      ...(ingredients !== undefined && { ingredients }),
      ...(benefits !== undefined && { benefits }),
      ...(req.file && {
        image: `/uploads/${req.file.filename}`,
      }),
      ...(!req.file && req.body.image && typeof req.body.image === "string" && {
        image: req.body.image.trim(),
      }),
    };

    const isAdmin = req.user.role === "admin";
    const product = await productService.updateProduct(
      req.params.id,
      req.user.id,
      updatePayload,
      isAdmin
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not have permission to edit this product",
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
    const isAdmin = req.user.role === "admin";
    const product = await productService.deleteProduct(
      req.params.id,
      req.user.id,
      isAdmin
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not have permission to delete this product",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

// GET /api/products/my-products
const getMyProducts = async (req, res) => {
  try {
    const products = await productService.getPractitionerProducts(
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
