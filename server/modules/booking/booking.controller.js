const bookingService = require("./booking.service");

/* =========================================================================
   PRACTITIONER CONTROLLERS
   ========================================================================= */

const createSession = async (req, res) => {
    try {
        const session = await bookingService.createPractitionerSession(
            req.user._id || req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Therapy session scheduled successfully.",
            session,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to create therapy session.",
        });
    }
};

const getPractitionerSessions = async (req, res) => {
    try {
        const sessions = await bookingService.getPractitionerSessions(
            req.user._id || req.user.id,
            req.query
        );

        res.status(200).json({
            success: true,
            sessions,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve practitioner sessions.",
        });
    }
};

const getPractitionerBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getPractitionerBookings(
            req.user._id || req.user.id,
            req.query
        );

        res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve practitioner bookings.",
        });
    }
};

const cancelPractitionerSession = async (req, res) => {
    try {
        const result = await bookingService.cancelPractitionerSession(
            req.user._id || req.user.id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: result.wasBooked
                ? "Therapy session cancelled. Client booking marked as cancelled."
                : "Therapy session cancelled successfully.",
            session: result.session,
            affectedBooking: result.affectedBooking,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to cancel therapy session.",
        });
    }
};

/* =========================================================================
   USER DISCOVERY & BOOKING CONTROLLERS
   ========================================================================= */

const getVerifiedPractitioners = async (req, res) => {
    try {
        const practitioners =
            await bookingService.getVerifiedPractitioners(req.query);

        res.status(200).json({
            success: true,
            practitioners,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve practitioners list.",
        });
    }
};

const getPractitionerProfile = async (req, res) => {
    try {
        const profile = await bookingService.getPractitionerProfile(
            req.params.id
        );

        res.status(200).json({
            success: true,
            ...profile,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve practitioner profile.",
        });
    }
};

const getAvailableSessions = async (req, res) => {
    try {
        const sessions = await bookingService.getAvailableSessions(req.query);

        res.status(200).json({
            success: true,
            sessions,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve available sessions.",
        });
    }
};

const getSessionById = async (req, res) => {
    try {
        const session = await bookingService.getSessionById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            session,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve session details.",
        });
    }
};

const bookSession = async (req, res) => {
    try {
        const result = await bookingService.bookTherapySession(
            req.user._id || req.user.id,
            req.params.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Therapy session booked successfully!",
            booking: result.booking,
            session: result.session,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to complete session booking.",
        });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getUserBookings(
            req.user._id || req.user.id,
            req.query
        );

        res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve bookings.",
        });
    }
};

const cancelUserBooking = async (req, res) => {
    try {
        const booking = await bookingService.cancelUserBooking(
            req.user._id || req.user.id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully. Slot has been freed.",
            booking,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to cancel booking.",
        });
    }
};

const getUserDashboardMetrics = async (req, res) => {
    try {
        const metrics = await bookingService.getUserDashboardMetrics(
            req.user._id || req.user.id
        );

        res.status(200).json({
            success: true,
            ...metrics,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Failed to retrieve dashboard metrics.",
        });
    }
};

module.exports = {
    createSession,
    getPractitionerSessions,
    getPractitionerBookings,
    cancelPractitionerSession,
    getVerifiedPractitioners,
    getPractitionerProfile,
    getAvailableSessions,
    getSessionById,
    bookSession,
    getUserBookings,
    cancelUserBooking,
    getUserDashboardMetrics,
};
