import ErrorHandler from "../utils/utility-class.js";
import { Order } from "../models/orderModel.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
export const newOrder = async (req, res, next) => {
    try {
        const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
        if (!shippingInfo ||
            !orderItems ||
            !user ||
            !subtotal ||
            !tax ||
            !total ||
            !shippingCharges ||
            !discount) {
            return next(new ErrorHandler("Provied all details", 400));
        }
        const order = await Order.create({
            shippingInfo,
            orderItems,
            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
        });
        await reduceStock(orderItems);
        await invalidateCache({ product: true, order: true, admin: true });
        return res.status(201).json({
            success: true,
            message: `order placed successfully`,
            order_id: order._id,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler("Internal server error", 500));
    }
};
