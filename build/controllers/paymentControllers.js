import ErrorHandler from "../utils/utility-class.js";
import { Discount } from "../models/discountModel.js";
export const newCouponCreate = async (req, res, next) => {
    try {
        const { coupon, amount } = req.body;
        if (!coupon || !amount)
            return next(new ErrorHandler("Enter all fields", 400));
        const couponExist = await Discount.findOne({ coupon });
        if (couponExist) {
            return next(new ErrorHandler("Coupon already exist", 400));
        }
        const newCoupon = await Discount.create({
            coupon,
            amount,
        });
        return res.status(201).json({
            success: true,
            newCoupon,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler("Internal server error", 500));
    }
};
export const getAllCoupons = async (req, res, next) => {
    try {
        const allCoupons = await Discount.find({});
        if (!allCoupons) {
            return next(new ErrorHandler("No coupons found", 404));
        }
        return res.status(200).json({
            success: true,
            allCoupons,
        });
    }
    catch (error) {
        return next(new ErrorHandler("Internal server error", 500));
    }
};
export const deleteCoupon = async (req, res, next) => {
    try {
        const { coupon } = req.query;
        if (!coupon) {
            return next(new ErrorHandler("Coupon code not provided", 400));
        }
        const coupons = await Discount.findOne({ coupon });
        if (!coupons) {
            return next(new ErrorHandler("Coupon not found", 404));
        }
        await coupons.deleteOne();
        return res.status(200).json({
            success: true,
            message: `Coupon ${coupons.coupon} deleted successfully`,
        });
    }
    catch (error) {
        return next(new ErrorHandler("Internal server error", 500));
    }
};
export const applyCoupon = async (req, res, next) => {
    try {
        const { coupon } = req.query;
        if (!coupon) {
            return next(new ErrorHandler("Coupon code not provided", 400));
        }
        const coupons = await Discount.findOne({ coupon });
        if (!coupons) {
            return next(new ErrorHandler("Invalid coupon code", 400));
        }
        return res.status(200).json({
            success: true,
            discount: coupons.amount,
        });
    }
    catch (error) {
        return next(new ErrorHandler("Internal server error", 500));
    }
};
