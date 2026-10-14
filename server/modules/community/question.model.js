const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 300,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    answersCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["open", "answered", "closed"],
      default: "open",
      index: true,
    },

    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ createdAt: -1 });
questionSchema.index({ category: 1, createdAt: -1 });
questionSchema.index({ status: 1, createdAt: -1 });

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

module.exports = Question;
