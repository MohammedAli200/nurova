import api from "../../../services/api";

/**
 * Fetch questions with optional filtering, search, and sorting
 */
export const getQuestions = async (params = {}) => {
  const response = await api.get("/api/community/questions", { params });
  return response.data;
};

/**
 * Fetch a single question with author details
 */
export const getQuestionById = async (questionId) => {
  const response = await api.get(`/api/community/questions/${questionId}`);
  return response.data;
};

/**
 * Post a new question (authenticated user/practitioner)
 */
export const createQuestion = async (questionData) => {
  const response = await api.post("/api/community/questions", questionData);
  return response.data;
};

/**
 * Fetch all practitioner answers for a question
 */
export const getAnswersForQuestion = async (questionId) => {
  const response = await api.get(
    `/api/community/questions/${questionId}/answers`
  );
  return response.data;
};

/**
 * Submit an answer by an authorized practitioner
 */
export const addAnswer = async (questionId, content) => {
  const response = await api.post(
    `/api/community/questions/${questionId}/answers`,
    { content }
  );
  return response.data;
};

/**
 * Fetch practitioner reviews and rating aggregate
 */
export const getPractitionerReviews = async (practitionerId) => {
  const response = await api.get(
    `/api/practitioners/${practitionerId}/reviews`
  );
  return response.data;
};

/**
 * Submit or update a practitioner review (authenticated user)
 */
export const addReview = async (practitionerId, reviewData) => {
  const response = await api.post(
    `/api/practitioners/${practitionerId}/reviews`,
    reviewData
  );
  return response.data;
};
