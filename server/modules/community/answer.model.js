const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    practitionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
  },
  {
    timestamps: true,
  }
);

answerSchema.index({ questionId: 1, createdAt: 1 });

const Answer =
  mongoose.models.Answer || mongoose.model("Answer", answerSchema);

module.exports = Answer;
