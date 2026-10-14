const Question = require("./question.model");
const Answer = require("./answer.model");
const Review = require("./review.model");
const User = require("../../models/user");
const Practitioner = require("../../models/practitioner");
const resolvePractitioner = require("../../utils/practitionerResolver");

/**
 * Get community questions with filtering, search, and sorting
 */
const getQuestions = async ({
  category = "all",
  search = "",
  status = "all",
  sort = "latest",
  page = 1,
  limit = 20,
} = {}) => {
  const query = {};

  if (category && category !== "all") {
    query.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [{ title: searchRegex }, { content: searchRegex }];
  }

  if (status === "unanswered") {
    query.answersCount = 0;
  } else if (status === "answered") {
    query.answersCount = { $gt: 0 };
  } else if (status === "open") {
    query.status = "open";
  }

  let sortOption = { createdAt: -1 };
  if (sort === "most-discussed") {
    sortOption = { answersCount: -1, createdAt: -1 };
  } else if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [questions, total] = await Promise.all([
    Question.find(query)
      .populate("author", "name username email bio role")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Question.countDocuments(query),
  ]);

  return {
    questions,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

/**
 * Get question by ID and increment views
 */
const getQuestionById = async (questionId) => {
  const question = await Question.findByIdAndUpdate(
    questionId,
    { $inc: { viewsCount: 1 } },
    { new: true }
  ).populate("author", "name username email bio role");

  if (!question) {
    const error = new Error("Question not found");
    error.statusCode = 404;
    throw error;
  }

  return question;
};

/**
 * Create a new question by an authenticated user
 */
const createQuestion = async (
  { title, content, category, tags = [] },
  authorId
) => {
  if (!title || !title.trim()) {
    const error = new Error("Question title is required");
    error.statusCode = 400;
    throw error;
  }

  if (!content || !content.trim()) {
    const error = new Error("Question content is required");
    error.statusCode = 400;
    throw error;
  }

  if (!category || !category.trim()) {
    const error = new Error("Category is required");
    error.statusCode = 400;
    throw error;
  }

  let parsedTags = [];
  if (Array.isArray(tags)) {
    parsedTags = tags.map((t) => String(t).trim()).filter(Boolean);
  } else if (typeof tags === "string") {
    parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  const question = await Question.create({
    title: title.trim(),
    content: content.trim(),
    category: category.trim(),
    tags: parsedTags,
    author: authorId,
  });

  return await Question.findById(question._id).populate(
    "author",
    "name username email bio role"
  );
};

/**
 * Get all answers for a question (supports multiple practitioner answers)
 */
const getAnswersForQuestion = async (questionId) => {
  const questionExists = await Question.exists({ _id: questionId });
  if (!questionExists) {
    const error = new Error("Question not found");
    error.statusCode = 404;
    throw error;
  }

  const answers = await Answer.find({ questionId }).sort({ createdAt: 1 }).lean();

  return await Promise.all(
    answers.map(async (answer) => {
      const practitioner = await resolvePractitioner(answer.practitionerId);
      return {
        ...answer,
        id: answer._id,
        practitionerId: practitioner,
        practitioner,
      };
    })
  );
};

/**
 * Add practitioner answer to a question
 */
const addAnswer = async ({ questionId, content }, practitionerId) => {
  if (!content || !content.trim()) {
    const error = new Error("Answer content is required");
    error.statusCode = 400;
    throw error;
  }

  const question = await Question.findById(questionId);
  if (!question) {
    const error = new Error("Question not found");
    error.statusCode = 404;
    throw error;
  }

  // Ensure practitioner exists and is a practitioner
  let practitionerDoc = await User.findById(practitionerId);
  if (!practitionerDoc) {
    practitionerDoc = await Practitioner.findById(practitionerId);
  }
  if (!practitionerDoc || practitionerDoc.role !== "practitioner") {
    const error = new Error("Only verified practitioners can answer questions");
    error.statusCode = 403;
    throw error;
  }

  // Create new answer
  const answer = await Answer.create({
    questionId,
    practitionerId,
    content: content.trim(),
  });

  // Increment answers count and update status
  question.answersCount += 1;
  question.status = "answered";
  await question.save();

  const raw = await Answer.findById(answer._id).lean();
  const practitioner = await resolvePractitioner(practitionerId);

  return {
    ...raw,
    id: raw._id,
    practitionerId: practitioner,
    practitioner,
  };
};

/**
 * Get all reviews and aggregate rating for a practitioner
 */
const getPractitionerReviews = async (practitionerId) => {
  const reviews = await Review.find({ practitionerId })
    .populate("userId", "name username email")
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? Number(
        (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
        ).toFixed(1)
      )
    : 0;

  // Breakdown of ratings (1-5 stars)
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (breakdown[r.rating] !== undefined) {
      breakdown[r.rating] += 1;
    }
  });

  return {
    reviews,
    totalReviews,
    averageRating,
    breakdown,
  };
};

/**
 * Add or update a review for a practitioner
 */
const addOrUpdateReview = async (
  { practitionerId, rating, comment },
  userId
) => {
  const numRating = Number(rating);
  if (!numRating || isNaN(numRating) || numRating < 1 || numRating > 5) {
    const error = new Error("Rating must be a number between 1 and 5");
    error.statusCode = 400;
    throw error;
  }

  if (!comment || !comment.trim()) {
    const error = new Error("Review comment is required");
    error.statusCode = 400;
    throw error;
  }

  // Ensure practitioner exists (User or Practitioner collection)
  let practitioner = await User.findById(practitionerId);
  if (!practitioner) {
    practitioner = await Practitioner.findById(practitionerId);
  }
  if (!practitioner || practitioner.role !== "practitioner") {
    const error = new Error("Practitioner not found");
    error.statusCode = 404;
    throw error;
  }

  // Prevent reviewing oneself
  if (String(practitionerId) === String(userId)) {
    const error = new Error("Practitioners cannot review themselves");
    error.statusCode = 400;
    throw error;
  }

  const review = await Review.findOneAndUpdate(
    { practitionerId, userId },
    {
      rating: numRating,
      comment: comment.trim(),
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  ).populate("userId", "name username email");

  const aggregate = await getPractitionerReviews(practitionerId);

  return {
    review,
    averageRating: aggregate.averageRating,
    totalReviews: aggregate.totalReviews,
  };
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  getAnswersForQuestion,
  addAnswer,
  getPractitionerReviews,
  addOrUpdateReview,
};
