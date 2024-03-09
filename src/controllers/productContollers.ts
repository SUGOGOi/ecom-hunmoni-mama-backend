import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/productModel.js";
import { NewProductRequestBody } from "../types/types.js";
import { rm } from "fs";
import { User } from "../models/userModel.js";

export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHandler("NO products found", 400));
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

export const getLatestProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("done");
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    // console.log(products);
    if (!products) {
      return next(new ErrorHandler("Error geting latest products!", 500));
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

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Product.distinct("category");

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Internal server error", 500));
  }
};

export const getCategoryWiseProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("done");
    const { category } = req.query;
    const products = await Product.find({ category: `${category}` });
    // console.log(products);
    if (!products) {
      return next(new ErrorHandler("NO products found", 400));
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
    return res.status(201).json({
      success: true,
      product,
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
    return res.status(200).json({
      success: true,
      message: `Product deleted`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error deleting user", 400));
  }
};

export const getAdminProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("done");
    const products = await Product.find({}).sort({ createdAt: -1 });
    // console.log(products);
    if (!products) {
      return next(new ErrorHandler("Error geting latest products!", 404));
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

    return res.status(201).json({
      success: true,
      message: `Product updated`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error deleting user", 500));
  }
};
