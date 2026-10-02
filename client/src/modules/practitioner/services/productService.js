import api from "../../../services/api";

export const getMyProducts = async () => {
    const response = await api.get("/api/products/my-products");
    return response.data;
};

export const createProduct = async (productData) => {
    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", String(productData.price));
    formData.append("category", productData.category);
    formData.append("stock", String(productData.stock));

    if (productData.image instanceof File) {
        formData.append("image", productData.image);
    }

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
    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", String(productData.price));
    formData.append("category", productData.category);
    formData.append("stock", String(productData.stock));

    if (productData.image instanceof File) {
        formData.append("image", productData.image);
    }

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