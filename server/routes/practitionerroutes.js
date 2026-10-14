const express = require("express");

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");
const uploadMiddleware = require("../middleware/uploadmiddleware");

const {
  registerPractitioner,
  getPractitionerProfile,
  uploadPractitionerDocument,
  getMyDocuments,
} = require("../modules/auth/practitionercontroller");

const {
  getPractitionerReviews,
  addReview,
} = require("../modules/community/community.controller");

const router = express.Router();

/*
 * Practitioner Registration
 * POST /api/practitioners/register
 *
 * This route does not require authentication.
 */
router.post(
  "/register",
  registerPractitioner
);

/*
 * Get logged-in practitioner profile
 * GET /api/practitioners/profile
 */
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("practitioner"),
  getPractitionerProfile
);

/*
 * Upload practitioner document
 * POST /api/practitioners/documents
 *
 * Form-data:
 * documentType
 * documentName
 * document
 */
router.post(
  "/documents",
  authMiddleware,
  roleMiddleware("practitioner"),
  uploadMiddleware.single("document"),
  uploadPractitionerDocument
);

/*
 * Get logged-in practitioner's documents
 * GET /api/practitioners/documents
 */
router.get(
  "/documents",
  authMiddleware,
  roleMiddleware("practitioner"),
  getMyDocuments
);

/*
 * Get practitioner reviews and rating aggregate
 * GET /api/practitioners/:id/reviews
 */
router.get("/:id/reviews", getPractitionerReviews);

/*
 * Submit practitioner review (authenticated users)
 * POST /api/practitioners/:id/reviews
 */
router.post("/:id/reviews", authMiddleware, addReview);

module.exports = router;