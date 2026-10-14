const express = require("express");
const uploadMiddleware = require("../middleware/uploadmiddleware");
const authMiddleware = require("../middleware/authmiddleware");

const {
  registerUser,
  registerPractitioner,
  login,
  getMe,
} = require("../modules/auth/authcontroller");

const router = express.Router();

/*
 * User Registration
 * POST /api/auth/register/user
 */
router.post("/register/user", registerUser);

/*
 * Practitioner Registration
 * POST /api/auth/register/practitioner
 */
router.post(
  "/register/practitioner",
  uploadMiddleware.single("document"),
  registerPractitioner
);

/*
 * User / Practitioner / Admin Login
 * POST /api/auth/login
 */
router.post("/login", login);

/*
 * Get Current User
 * GET /api/auth/me
 */
router.get("/me", authMiddleware, getMe);

module.exports = router;