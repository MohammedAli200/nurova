const express = require("express");

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const {
  adminLogin,
  getPendingPractitionersController,
  getPractitionerForVerificationController,
  verifyPractitioner,
  verifyDocument,
} = require("../modules/auth/admincontroller");

const {
  dashboard,
  practitioners,
  practitionerDetails,
  approve,
  reject,
  users,
} = require("../modules/admin/admin.controller");

const router = express.Router();

/*
 * Admin Login
 * POST /api/admin/login
 */
router.post("/login", adminLogin);

/*
 * Admin Protected Routes
 */
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

/*
 * Dashboard Stats
 * GET /api/admin/dashboard
 */
router.get("/dashboard", dashboard);

/*
 * Practitioners Listing
 * GET /api/admin/practitioners
 */
router.get("/practitioners", practitioners);

/*
 * Legacy / alternative route for pending practitioners
 * GET /api/admin/practitioners/pending
 */
router.get("/practitioners/pending", getPendingPractitionersController);

/*
 * Practitioner Details
 * GET /api/admin/practitioners/:id
 */
router.get("/practitioners/:id", practitionerDetails);

/*
 * Approve Practitioner
 * PATCH /api/admin/practitioners/:id/approve
 */
router.patch("/practitioners/:id/approve", approve);

/*
 * Reject Practitioner
 * PATCH /api/admin/practitioners/:id/reject
 */
router.patch("/practitioners/:id/reject", reject);

/*
 * Verify Practitioner (Status in Body)
 * PATCH /api/admin/practitioners/:practitionerId/verify
 */
router.patch("/practitioners/:practitionerId/verify", verifyPractitioner);

/*
 * Verify Document
 * PATCH /api/admin/documents/:documentId/verify
 */
router.patch("/documents/:documentId/verify", verifyDocument);

/*
 * Users Listing
 * GET /api/admin/users
 */
router.get("/users", users);

module.exports = router;