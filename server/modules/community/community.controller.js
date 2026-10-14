const communityService = require("./community.service");

// GET /api/community/questions
const getQuestions = async (req, res) => {
  try {
    const { category, search, status, sort, page, limit } = req.query;

    const result = await communityService.getQuestions({
      category,
      search,
      status,
      sort,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result.questions,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch community questions",
    });
  }
};

// GET /api/community/questions/:id
const getQuestionById = async (req, res) => {
  try {
    const question = await communityService.getQuestionById(req.params.id);

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch question details",
    });
  }
};

// POST /api/community/questions
const createQuestion = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const authorId = req.user.id;

    const question = await communityService.createQuestion(
      { title, content, category, tags },
      authorId
    );

    res.status(201).json({
      success: true,
      message: "Question posted successfully",
      data: question,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create question",
    });
  }
};

// GET /api/community/questions/:id/answers
const getAnswersForQuestion = async (req, res) => {
  try {
    const answers = await communityService.getAnswersForQuestion(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: answers,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch answers",
    });
  }
};

// POST /api/community/questions/:id/answers
const addAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const practitionerId = req.user.id;

    const answer = await communityService.addAnswer(
      {
        questionId: req.params.id,
        content,
      },
      practitionerId
    );

    res.status(201).json({
      success: true,
      message: "Answer submitted successfully",
      data: answer,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to submit answer",
    });
  }
};

// GET /api/practitioners/:id/reviews or /api/community/reviews/:id
const getPractitionerReviews = async (req, res) => {
  try {
    const practitionerId = req.params.id || req.params.practitionerId;
    const result = await communityService.getPractitionerReviews(
      practitionerId
    );

    res.status(200).json({
      success: true,
      data: result.reviews,
      averageRating: result.averageRating,
      totalReviews: result.totalReviews,
      breakdown: result.breakdown,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch practitioner reviews",
    });
  }
};

// POST /api/practitioners/:id/reviews or /api/community/reviews/:id
const addReview = async (req, res) => {
  try {
    const practitionerId = req.params.id || req.params.practitionerId;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const result = await communityService.addOrUpdateReview(
      { practitionerId, rating, comment },
      userId
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: result.review,
      averageRating: result.averageRating,
      totalReviews: result.totalReviews,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to submit review",
    });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  getAnswersForQuestion,
  addAnswer,
  getPractitionerReviews,
  addReview,
};
