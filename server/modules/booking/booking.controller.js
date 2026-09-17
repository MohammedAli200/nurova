import * as bookingService from "./booking.service.js";

/* =========================================================================
   PRACTITIONER CONTROLLERS
   ========================================================================= */

export const createSession = async (req, res) => {
    try {
        const session = await bookingService.createPractitionerSession(
            req.user._id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Therapy session scheduled successfully.",
            session,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to create therapy session.",
        });
    }
};

export const getPractitionerSessions = async (req, res) => {
    try {
        const sessions = await bookingService.getPractitionerSessions(
            req.user._id,
            req.query
        );

        res.status(200).json({
            success: true,
            sessions,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to retrieve practitioner sessions.",
        });
    }
};

export const getPractitionerBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getPractitionerBookings(
            req.user._id,
            req.query
        );

        res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to retrieve practitioner bookings.",
        });
    }
};

export const cancelPractitionerSession = async (req, res) => {
    try {
        const session = await bookingService.cancelPractitionerSession(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Therapy session cancelled successfully.",
            session,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to cancel therapy session.",
        });
    }
};

/* =========================================================================
   USER DISCOVERY & BOOKING CONTROLLERS
   ========================================================================= */

export const getVerifiedPractitioners = async (req, res) => {
    try {
        const practitioners = await bookingService.getVerifiedPractitioners(
            req.query
        );

        res.status(200).json({
            success: true,
            practitioners,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to retrieve verified practitioners.",
        });
    }
};

export const getPractitionerProfile = async (req, res) => {
    try {
        const data = await bookingService.getPractitionerProfile(
            req.params.id
        );

        res.status(200).json({
            success: true,
            ...data,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to retrieve practitioner profile.",
        });
    }
};

export const getAvailableSessions = async (req, res) => {
    try {
        const sessions = await bookingService.getAvailableSessions(req.query);

        res.status(200).json({
            success: true,
            sessions,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to retrieve available sessions.",
        });
    }
};

export const getSessionById = async (req, res) => {
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
            message:
                error.message || "Failed to retrieve therapy session.",
        });
    }
};

export const bookSession = async (req, res) => {
    try {
        const result = await bookingService.bookTherapySession(
            req.user._id,
            req.params.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Your therapy session has been confirmed.",
            booking: result.booking,
            session: result.session,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Unable to confirm booking.",
        });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getUserBookings(
            req.user._id,
            req.query
        );

        res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to retrieve user bookings.",
        });
    }
};

export const cancelUserBooking = async (req, res) => {
    try {
        const booking = await bookingService.cancelUserBooking(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully.",
            booking,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to cancel booking.",
        });
    }
};

export const getUserDashboardMetrics = async (req, res) => {
    try {
        const metrics = await bookingService.getUserDashboardMetrics(
            req.user._id
        );

        res.status(200).json({
            success: true,
            ...metrics,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message:
                error.message || "Failed to retrieve dashboard metrics.",
        });
    }
};
