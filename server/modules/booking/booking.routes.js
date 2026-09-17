import express from "express";
import {
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
} from "./booking.controller.js";

import { authenticate } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

// All booking & discovery endpoints require authentication
router.use(authenticate);

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
    requireRole("practitioner"),
    createSession
);

router.get(
    "/practitioner/sessions",
    requireRole("practitioner"),
    getPractitionerSessions
);

router.get(
    "/practitioner/bookings",
    requireRole("practitioner"),
    getPractitionerBookings
);

router.patch(
    "/practitioner/sessions/:id/cancel",
    requireRole("practitioner"),
    cancelPractitionerSession
);

router.patch(
    "/sessions/:id/cancel",
    requireRole("practitioner"),
    cancelPractitionerSession
);

export default router;
