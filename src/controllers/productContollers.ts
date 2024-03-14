import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/productModel.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { rm } from "fs";
import { User } from "../models/userModel.js";
import { myCahe } from "../app.js";
import { invalidateCache } from "../utils/features.js";

//---------------------------------------revalidate single product & totla page cache on new, update, delete & new order
export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    let product;

    if (myCahe.has(`product-${id}`)) {
      product = JSON.parse(myCahe.get(`product-${id}`)!);
    } else {
      product = await Product.findById(id);
      if (!product) {
        return next(new ErrorHandler("NO products found", 400));
      }
      myCahe.set(`product-${id}`, JSON.stringify(product));
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

//---------------------------------------revalidate product cache on new, update, delete & new order
export const getLatestProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let products = [];

    if (myCahe.has("latest-products")) {
      products = JSON.parse(myCahe.get("latest-products")!);
    } else {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      if (!products) {
        return next(new ErrorHandler("Error geting latest products!", 500));
      }
      //cache
      myCahe.set("latest-products", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

//---------------------------------------revalidate category cache on new, update, delete & new order
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let categories = [];
    if (myCahe.has("categories")) {
      categories = JSON.parse(myCahe.get("categories")!);
    } else {
      categories = await Product.distinct("category");
      if (!categories)
        return next(new ErrorHandler("Internal server error", 500));
      myCahe.set("categories", JSON.stringify(categories));
    }

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

//---------------------------------------revalidate adminproducts cache on new, update, delete & new order
export const getAdminProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let products = [];

    if (myCahe.has("admin-products")) {
      products = JSON.parse(myCahe.get("admin-products")!);
    } else {
      products = await Product.find({}).sort({ createdAt: -1 });
      if (!products) {
        return next(new ErrorHandler("Error geting latest products!", 404));
      }
      myCahe.set("admin-products", JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

export const getSearchProducts = async (
  req: Request<{}, {}, {}, SearchRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, search, sort, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 6;
    const skip = limit * (page - 1);

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.product_name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredProducts] = await Promise.all([
      productPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredProducts.length / limit); //take upper value

    if (!products) {
      return next(new ErrorHandler("NO products found", 400));
    }
    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

export const newProduct = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_name, stock, category, description, price } = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Upload photo", 400));
    if (!product_name || !stock || !category || !description || !price) {
      rm(photo.path, () => {
        console.log("photo deleted");
      });
      return next(new ErrorHandler("Enter all fields", 400));
    }

    const product = await Product.create({
      product_name,
      photo: photo.path,
      stock,
      category,
      description,
      price,
    });
    await invalidateCache({
      product: true,
      admin: true,
      productId: String(product._id),
    });
    return res.status(201).json({
      success: true,
      message: `Product created successfully`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const product = await Product.findById(id);
    // console.log(user)
    if (!product) {
      return next(new ErrorHandler("Invalid Id or Product doesn't exist", 400));
    }

    rm(product.photo, () => {
      console.log("photo deleted");
    });

    await product.deleteOne();

    await invalidateCache({
      product: true,
      admin: true,
      productId: String(product._id),
    });

    return res.status(200).json({
      success: true,
      message: `Product deleted`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error deleting user", 400));
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const { product_name, price, stock, category, description } = req.body;
    const photo = req.file;

    const product = await Product.findById(id);
    // console.log(user)
    if (!product) {
      if (photo) {
        rm(photo.path, () => {
          console.log("photo deleted");
        });
      }
      return next(new ErrorHandler("Invalid Id or User doesn't exist", 404));
    }
    if (photo) {
      rm(product.photo, () => {
        console.log("photo deleted");
      });
      product.photo = photo.path;
    }

    if (product_name) product.product_name = product_name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (description) product.description = description;

    await product.save();

    await invalidateCache({
      product: true,
      admin: true,
      productId: String(product._id),
    });

    return res.status(201).json({
      success: true,
      message: `Product updated`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error deleting user", 500));
  }
};
