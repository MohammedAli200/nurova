import api from "../../../services/api";

export const registerUser = async (data) => {
    const response = await api.post(
        "/api/auth/register/user",
        data
    );

    return response.data;
};

export const registerPractitioner = async (data) => {
    const response = await api.post(
        "/api/auth/register/practitioner",
        data
    );

    return response.data;
};

export const loginUser = async (data) => {
    const response = await api.post(
        "/api/auth/login",
        data
    );

    return response.data;
};

export const getMe = async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
};