import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/productModel.js";
export const getSingleProduct = (req, res, next) => {
    try {
    }
    catch (error) {
        return next(new ErrorHandler("Internal server error", 500));
    }
};
export const getLatestProducts = async (req, res, next) => {
    try {
        console.log("done");
        const products = await Product.find({}).sort({ createdAt: -1 });
        console.log(products);
        if (!products) {
            return next(new ErrorHandler("Error geting latest products!", 500));
        }
        return res.status(200).json({
            success: true,
            products,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler("Internal server error", 500));
    }
};
