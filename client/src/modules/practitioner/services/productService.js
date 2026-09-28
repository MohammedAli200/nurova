import api from "../../../services/api";

export const getMyProducts = async () => {
    const response = await api.get("/api/practitioners/products");
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await api.post("/api/products", productData);
    return response.data;
};

export const updateProduct = async (productId, productData) => {
    const response = await api.put(`/api/products/${productId}`, productData);
    return response.data;
};

export const deleteProduct = async (productId) => {
    const response = await api.delete(`/api/products/${productId}`);
    return response.data;
};
