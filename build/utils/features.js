import { myCahe } from "../app.js";
import { Product } from "../models/productModel.js";
import ErrorHandler from "./utility-class.js";
export const invalidateCache = ({ product, order, admin, orderId, productId, userId, }) => {
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
        myCahe.del("admin-stats");
        myCahe.del("admin-bar-chart");
        myCahe.del("admin-pie-chart");
        myCahe.del("admin-line-chart");
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
export const calculatePercentage = (thisMonth, lastMonth) => {
    console.log(thisMonth, lastMonth);
    if (lastMonth === 0)
        return thisMonth * 100;
    const percentage = (thisMonth / lastMonth) * 100;
    return Number(percentage.toFixed(0));
};
export const getChartData = ({ length, docArr }) => {
    const today = new Date();
    const dataArr = new Array(length).fill(0);
    docArr.forEach((i) => {
        const createDate = i.createdAt;
        let monthDiff = (today.getMonth() - createDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            dataArr[length - monthDiff - 1] = dataArr[length - monthDiff - 1] + 1;
        }
    });
    return dataArr;
};
export const getChartDataProduct = ({ length, docArr }) => {
    const today = new Date();
    const dataArr = new Array(length).fill(0);
    docArr.forEach((i) => {
        const createDate = i.createdAt;
        let monthDiff = (today.getMonth() - createDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            dataArr[length - monthDiff - 1] =
                dataArr[length - monthDiff - 1] + i.stock;
        }
    });
    return dataArr;
};
