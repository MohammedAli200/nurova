const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    practitionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1500,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ practitionerId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ practitionerId: 1, createdAt: -1 });

const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

module.exports = Review;
