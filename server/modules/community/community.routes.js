const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authmiddleware");
const roleMiddleware = require("../../middleware/rolemiddleware");

const {
  getQuestions,
  getQuestionById,
  createQuestion,
  getAnswersForQuestion,
  addAnswer,
  getPractitionerReviews,
  addReview,
} = require("./community.controller");

// ==========================================
// Community Questions
// ==========================================

// GET /api/community/questions - List questions (search, filter, sort, paginate)
router.get("/questions", getQuestions);

// POST /api/community/questions - Ask a question (authenticated user/practitioner)
router.post("/questions", authMiddleware, createQuestion);

// GET /api/community/questions/:id - Get question details
router.get("/questions/:id", getQuestionById);

// ==========================================
// Community Answers (Practitioner Only)
// ==========================================

// GET /api/community/questions/:id/answers - Get all practitioner answers for question
router.get("/questions/:id/answers", getAnswersForQuestion);

// POST /api/community/questions/:id/answers - Submit answer (practitioner only)
router.post(
  "/questions/:id/answers",
  authMiddleware,
  roleMiddleware("practitioner", "admin"),
  addAnswer
);

// ==========================================
// Community Practitioner Reviews
// ==========================================

// GET /api/community/reviews/:practitionerId - Get reviews & rating summary
router.get("/reviews/:practitionerId", getPractitionerReviews);

// POST /api/community/reviews/:practitionerId - Submit or update review
router.post("/reviews/:practitionerId", authMiddleware, addReview);

module.exports = router;
