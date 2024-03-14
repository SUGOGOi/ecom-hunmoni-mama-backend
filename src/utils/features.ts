import { myCahe } from "../app.js";
import { Product } from "../models/productModel.js";
import { InvalidateCacheProps, orderItemType } from "../types/types.js";
import ErrorHandler from "./utility-class.js";

export const invalidateCache = async ({
  product,
  order,
  admin,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "admin-products",
      "categories",
    ];
    const products = await Product.find({}).select("_id");
    products.forEach((i) => {
      productKeys.push(`product-${i._id}`);
    });
    myCahe.del(productKeys);
  }
  if (admin) {
  }
  if (order) {
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

export const updateStock = async (orderItems: orderItemType[]) => {};
