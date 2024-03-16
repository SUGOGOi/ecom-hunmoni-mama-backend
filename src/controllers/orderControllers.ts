import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/orderModel.js";
import {
  invalidateCache,
  reduceStock,
  updateStock,
} from "../utils/features.js";
import { myCahe } from "../app.js";

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

    if (
      !shippingInfo ||
      !orderItems ||
      !user ||
      !subtotal ||
      !tax ||
      !total ||
      !shippingCharges ||
      !discount
    ) {
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

    invalidateCache({
      product: true,
      order: true,
      admin: true,
      orderId: String(order._id),
      userId: String(order.user),
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res.status(201).json({
      success: true,
      message: `order placed successfully`,
      order_id: order._id,
    });
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
};

export const myOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.query;
    if (!_id) return next(new ErrorHandler("Invaid user ID", 400));
    let orders = [];

    if (myCahe.has(`orders-${_id}`)) {
      orders = JSON.parse(myCahe.get(`orders-${_id}`)!);
    } else {
      orders = await Order.find({ user: `${_id}` });
      if (!orders) return next(new ErrorHandler("No orders found", 404));
      myCahe.set(`orders-${_id}`, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

export const allOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let orders = [];

    if (myCahe.has(`all-orders`)) {
      orders = JSON.parse(myCahe.get(`all-orders`)!);
    } else {
      orders = await Order.find().populate("user", "name");
      if (!orders) return next(new ErrorHandler("No orders found", 404));
      myCahe.set(`all-orders`, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

export const specificOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req.query;
    if (!user) return next(new ErrorHandler("Invaid user ID", 400));

    let orders = [];

    if (myCahe.has(`orders-${user}`)) {
      orders = JSON.parse(myCahe.get(`orders-${user}`)!);
    } else {
      orders = await Order.find({ user: `${user}` }).populate("user", "name");
      if (!orders) return next(new ErrorHandler("No orders found", 404));
      myCahe.set(`orders-${user}`, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

export const orderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params;
    if (!_id) return next(new ErrorHandler("Order not found", 404));

    let order;
    if (myCahe.has(`orderDetails-${_id}`)) {
      order = JSON.parse(myCahe.get(`orderDetails-${_id}`)!);
    } else {
      order = await Order.findById(_id).populate("user", "name");
      if (!order) return next(new ErrorHandler("No orders found", 404));
      myCahe.set(`orderDetails-${_id}`, JSON.stringify(order));
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params;
    // console.log(id);
    const order = await Order.findById(_id);
    // console.log(user)
    if (!order || order.status === "Delivered") {
      return next(new ErrorHandler("order not found", 404));
    }
    const orderItems: any[] = order?.orderItems;

    await updateStock(orderItems);

    await order.deleteOne();
    invalidateCache({
      product: true,
      order: true,
      admin: true,
      orderId: String(order._id),
      userId: String(order.user),
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res.status(200).json({
      success: true,
      message: `Order canceled`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error deleting user", 400));
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params;
    if (!_id) return next(new ErrorHandler("Invalid id", 404));

    const order = await Order.findById(_id).populate("user", "name");

    if (!order) return next(new ErrorHandler("Order not found", 404));

    switch (order.status) {
      case "Processing":
        order.status = "Shipped";
        break;
      case "Shipped":
        order.status = "Delivered";
        break;
      default:
        order.status = "Delivered";
        break;
    }
    await order.save();
    invalidateCache({
      product: false,
      order: true,
      admin: true,
      orderId: String(order._id),
      userId: String(order.user),
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res.status(200).json({
      success: true,
      order_status: `order status updated : ${order.status}`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};
