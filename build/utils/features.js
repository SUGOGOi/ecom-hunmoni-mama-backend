import { myCahe } from "../app.js";
import { Product } from "../models/productModel.js";
import ErrorHandler from "./utility-class.js";
export const invalidateCache = async ({ product, order, admin, orderId, productId, userId, }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "admin-products",
            "categories",
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object") {
            productId.forEach((i) => {
                productKeys.push(`product-${i}`);
            });
        }
        myCahe.del(productKeys);
    }
    if (admin) {
    }
    if (order) {
        const orderKeys = [
            "all-orders",
            `orders-${orderId}`,
            `orders-${userId}`,
            `orderDetails-${orderId}`,
        ];
        myCahe.del(orderKeys);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new ErrorHandler(`product of id:${order.productId} not found`, 404);
        product.stock = product.stock - order.quantity;
        await product.save();
    }
};
export const updateStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new ErrorHandler(`product of id:${order.productId} not found`, 404);
        product.stock = product.stock + order.quantity;
        await product.save();
    }
};
