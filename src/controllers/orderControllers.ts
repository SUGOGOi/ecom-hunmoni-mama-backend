import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/orderModel.js";

export const newOrder = async (
  req: Request<{}, {}, NewOrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
};
