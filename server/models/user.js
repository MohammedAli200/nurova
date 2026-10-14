const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },

    username: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: true,
    },

    role: {
      type: String,
      enum: ["user", "practitioner", "admin"],
      default: "user",
    },

    specialization: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    qualification: {
      type: String,
      trim: true,
    },

    document: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      originalname: String,
    },

    documents: [
      {
        documentType: String,
        documentName: String,
        filePath: String,
        originalFileName: String,
        mimeType: String,
        verificationStatus: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isApproved: {
      type: Boolean,
      default: function () {
        return this.role === "user";
      },
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "user" ? "approved" : "pending";
      },
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "user" ? "approved" : "pending";
      },
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
