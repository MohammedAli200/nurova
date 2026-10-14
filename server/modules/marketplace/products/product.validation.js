const validateProduct = (product) => {
  const { name, description, price, category, stock } = product;

  if (!name || !name.trim()) {
    return {
      valid: false,
      message: "Product name is required",
    };
  }

  if (!description || !description.trim()) {
    return {
      valid: false,
      message: "Product description is required",
    };
  }

  if (!category || !category.trim()) {
    return {
      valid: false,
      message: "Category is required",
    };
  }

  const numPrice = Number(price);
  if (price === undefined || price === null || isNaN(numPrice) || numPrice < 0) {
    return {
      valid: false,
      message: "Price must be a valid non-negative number",
    };
  }

  const numStock = Number(stock);
  if (stock === undefined || stock === null || isNaN(numStock) || numStock < 0) {
    return {
      valid: false,
      message: "Stock must be a valid non-negative integer",
    };
  }

  return {
    valid: true,
    message: "Product data is valid",
  };
};

module.exports = validateProduct;