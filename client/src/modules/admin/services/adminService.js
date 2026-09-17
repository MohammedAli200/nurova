import api from "../../../services/api";

export const getDashboardStats = async () => {
    const response = await api.get(
        "/api/admin/dashboard"
    );

    return response.data;
};

export const getPractitioners = async (
    params = {}
) => {
    const response = await api.get(
        "/api/admin/practitioners",
        {
            params,
        }
    );

    return response.data;
};

export const getPractitioner = async (
    id
) => {
    const response = await api.get(
        `/api/admin/practitioners/${id}`
    );

    return response.data;
};

export const approvePractitioner = async (
    id
) => {
    const response = await api.patch(
        `/api/admin/practitioners/${id}/approve`
    );

    return response.data;
};

export const rejectPractitioner = async (
    id
) => {
    const response = await api.patch(
        `/api/admin/practitioners/${id}/reject`
    );

    return response.data;
};

export const getUsers = async (
    params = {}
) => {
    const response = await api.get(
        "/api/admin/users",
        {
            params,
        }
    );

    return response.data;
};