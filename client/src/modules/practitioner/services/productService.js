import api from "../../../services/api";

export const getMyProducts = async () => {
    const response = await api.get("/api/products/my-products");
    return response.data;
};

const buildFormData = (productData) => {
    const formData = new FormData();

    if (productData.name) formData.append("name", productData.name);
    if (productData.shortDescription !== undefined)
        formData.append("shortDescription", productData.shortDescription);
    if (productData.description)
        formData.append("description", productData.description);
    if (productData.price !== undefined)
        formData.append("price", String(productData.price));
    if (productData.category)
        formData.append("category", productData.category);
    if (productData.stock !== undefined)
        formData.append("stock", String(productData.stock));
    if (productData.inStock !== undefined)
        formData.append("inStock", String(productData.inStock));
    if (productData.brand !== undefined)
        formData.append("brand", productData.brand);
    if (productData.specifications !== undefined)
        formData.append("specifications", productData.specifications);
    if (productData.usageInstructions !== undefined)
        formData.append("usageInstructions", productData.usageInstructions);
    if (productData.ingredients !== undefined)
        formData.append("ingredients", productData.ingredients);
    if (productData.benefits !== undefined)
        formData.append("benefits", productData.benefits);

    if (productData.image instanceof File) {
        formData.append("image", productData.image);
    } else if (typeof productData.image === "string" && productData.image) {
        formData.append("image", productData.image);
    }

    return formData;
};

export const createProduct = async (productData) => {
    const formData = buildFormData(productData);

    const response = await api.post(
        "/api/products",
        formData,
        {
            headers: {
                "Content-Type": undefined,
            },
        }
    );

    return response.data;
};

export const updateProduct = async (productId, productData) => {
    const formData = buildFormData(productData);

    const response = await api.put(
        `/api/products/${productId}`,
        formData,
        {
            headers: {
                "Content-Type": undefined,
            },
        }
    );

    return response.data;
};

export const deleteProduct = async (productId) => {
    const response = await api.delete(
        `/api/products/${productId}`
    );

    return response.data;
};