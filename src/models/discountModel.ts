import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    coupon: {
      type: String,
      required: [true, "Please enter coupon code"],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Please enter discount amount"],
    },
  },
  { timestamps: true }
);

export const Discount = mongoose.model("discount", discountSchema);
