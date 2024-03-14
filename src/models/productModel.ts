import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: [true, "Enter product name"],
      unique: [true, "Product already available"],
    },
    photo: {
      type: String,
      required: [true, "Upload product photo"],
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Enter price of the product"],
    },
    category: {
      type: String,
      required: [true, "Enter product category"],
    },
    description: {
      type: String,
      required: [true, "Enter product description"],
    },
    review: [
      {
        review_photo: {
          type: String,
        },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "user",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        rating: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("product", productSchema);
