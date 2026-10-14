const express = require("express");
const {
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
} = require("./booking.controller");

const authMiddleware = require("../../middleware/authmiddleware");
const roleMiddleware = require("../../middleware/rolemiddleware");

const router = express.Router();

// All booking & discovery endpoints require authentication
router.use(authMiddleware);

/* =========================================================================
   USER DISCOVERY & BOOKING ROUTES
   ========================================================================= */

// Discover verified practitioners
router.get("/practitioners", getVerifiedPractitioners);
router.get("/practitioners/:id", getPractitionerProfile);

// Availability & Session lookups
router.get("/available-sessions", getAvailableSessions);
router.get("/sessions/:id", getSessionById);

// Book therapy session
router.post("/sessions/:id/book", bookSession);

// User booking history & management
router.get("/my-bookings", getUserBookings);
router.patch("/my-bookings/:id/cancel", cancelUserBooking);

// User dashboard metrics
router.get("/dashboard-metrics", getUserDashboardMetrics);

/* =========================================================================
   PRACTITIONER SCHEDULING ROUTES (Practitioner Role Only)
   ========================================================================= */

router.post(
    "/practitioner/sessions",
    roleMiddleware("practitioner"),
    createSession
);

router.get(
    "/practitioner/sessions",
    roleMiddleware("practitioner"),
    getPractitionerSessions
);

router.get(
    "/practitioner/bookings",
    roleMiddleware("practitioner"),
    getPractitionerBookings
);

router.patch(
    "/practitioner/sessions/:id/cancel",
    roleMiddleware("practitioner"),
    cancelPractitionerSession
);

router.patch(
    "/sessions/:id/cancel",
    roleMiddleware("practitioner"),
    cancelPractitionerSession
);

module.exports = router;
