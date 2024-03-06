import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: [true, "Enter product name"],
    },
    photo: {
        type: String,
        required: [true, "Upload product photo"],
    },
    stock: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: [true, "Enter product category"]
    },
    description: {
        type: String,
        required: [true, "Enter product description"]
    },
    review: [{
            review_photo: {
                type: String,
            },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            rating: {
                type: Number,
            }
        }]
}, { timestamps: true });
export const Product = mongoose.model("product", productSchema);
