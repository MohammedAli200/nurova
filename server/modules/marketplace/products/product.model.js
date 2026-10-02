const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    practitionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Practitioner",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    originalPrice: {
      type: Number,
      min: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    dosha: {
      type: String,
      trim: true,
    },

    doshaLabel: {
      type: String,
      trim: true,
    },

    benefits: {
      type: [String],
      default: [],
    },

    organic: {
      type: Boolean,
      default: false,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    stockCount: {
      type: Number,
      min: 0,
    },

    icon: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    ingredients: {
      type: [String],
      default: [],
    },

    dosage: {
      type: String,
      trim: true,
    },

    certifications: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
