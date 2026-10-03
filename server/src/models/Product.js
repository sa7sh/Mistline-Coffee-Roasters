const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    origin: {
      type: String,
      required: true,
      enum: ["Chikmagalur", "Coorg", "Araku"],
    },
    roast: {
      type: String,
      required: true,
      enum: ["Light", "Medium", "Dark"],
    },
    tastingNotes: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Weight must be whole grams",
      },
    },
    price: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Price must be whole rupees",
      },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number",
      },
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);