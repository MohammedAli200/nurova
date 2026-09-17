import api from "../../../services/api";

/* =========================================================================
   PRACTITIONER DISCOVERY & PROFILES
   ========================================================================= */

export const getVerifiedPractitioners = async (params = {}) => {
    const response = await api.get("/api/booking/practitioners", { params });
    return response.data;
};

export const getPractitionerProfile = async (id) => {
    const response = await api.get(`/api/booking/practitioners/${id}`);
    return response.data;
};

/* =========================================================================
   AVAILABLE SESSIONS & BOOKING
   ========================================================================= */

export const getAvailableSessions = async (params = {}) => {
    const response = await api.get("/api/booking/available-sessions", { params });
    return response.data;
};

export const getSessionById = async (id) => {
    const response = await api.get(`/api/booking/sessions/${id}`);
    return response.data;
};

export const bookSession = async (sessionId, bookingData = {}) => {
    const response = await api.post(
        `/api/booking/sessions/${sessionId}/book`,
        bookingData
    );
    return response.data;
};

/* =========================================================================
   USER BOOKINGS & DASHBOARD
   ========================================================================= */

export const getUserBookings = async (params = {}) => {
    const response = await api.get("/api/booking/my-bookings", { params });
    return response.data;
};

export const cancelUserBooking = async (bookingId) => {
    const response = await api.patch(
        `/api/booking/my-bookings/${bookingId}/cancel`
    );
    return response.data;
};

export const getUserDashboardMetrics = async () => {
    const response = await api.get("/api/booking/dashboard-metrics");
    return response.data;
};

/* =========================================================================
   PRACTITIONER SCHEDULING & CLIENT BOOKINGS
   ========================================================================= */

export const createPractitionerSession = async (sessionData) => {
    const response = await api.post(
        "/api/booking/practitioner/sessions",
        sessionData
    );
    return response.data;
};

export const getPractitionerSessions = async (params = {}) => {
    const response = await api.get("/api/booking/practitioner/sessions", {
        params,
    });
    return response.data;
};

export const getPractitionerBookings = async (params = {}) => {
    const response = await api.get("/api/booking/practitioner/bookings", {
        params,
    });
    return response.data;
};

export const cancelPractitionerSession = async (sessionId) => {
    const response = await api.patch(
        `/api/booking/practitioner/sessions/${sessionId}/cancel`
    );
    return response.data;
};
