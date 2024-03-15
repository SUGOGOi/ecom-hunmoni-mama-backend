import { myCahe } from "../app.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { InvalidateCacheProps, orderItemType } from "../types/types.js";
import ErrorHandler from "./utility-class.js";

export const invalidateCache = async ({
  product,
  order,
  admin,
  orderId,
  productId,
  userId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "admin-products",
      "categories",
    ];
    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    if (typeof productId === "object") {
      productId.forEach((i) => {
        productKeys.push(`product-${i}`);
      });
    }
    myCahe.del(productKeys);
  }
  if (admin) {
    myCahe.del("admin-stats");
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `orders-${orderId}`,
      `orders-${userId}`,
      `orderDetails-${orderId}`,
    ];
    myCahe.del(orderKeys);
  }
};

export const reduceStock = async (orderItems: orderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product)
      throw new ErrorHandler(`product of id:${order.productId} not found`, 404);
    product.stock = product.stock - order.quantity;
    await product.save();
  }
};

export const updateStock = async (orderItems: orderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product)
      throw new ErrorHandler(`product of id:${order.productId} not found`, 404);
    product.stock = product.stock + order.quantity;
    await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  console.log(thisMonth, lastMonth);
  if (lastMonth === 0) return thisMonth * 100;
  const percentage = ((thisMonth - lastMonth) / lastMonth) * 100;
  return Number(percentage.toFixed(0));
};
