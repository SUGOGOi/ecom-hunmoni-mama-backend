import { myCahe } from "../app.js";
import { Product } from "../models/productModel.js";
export const invalidateCache = async ({ product, order, admin, }) => {
    if (product) {
        const productKeys = [
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
