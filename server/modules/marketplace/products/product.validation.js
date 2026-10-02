const validateProduct = (product) => {
  const { name, description, price, category, stock } = product;

  if (!name || !description || !category) {
    return {
      valid: false,
      message: "Name, description, and category are required",
    };
  }

  if (price === undefined || price < 0) {
    return {
      valid: false,
      message: "Price must be a valid positive number",
    };
  }

  if (stock === undefined || stock < 0) {
    return {
      valid: false,
      message: "Stock must be a valid positive number",
    };
  }

  return {
    valid: true,
    message: "Product data is valid",
  };
};

module.exports = validateProduct;