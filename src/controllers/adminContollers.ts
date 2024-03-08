import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/userModel.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/productModel.js";
import { rm } from "fs";

//<-----------------------------------------FOR USERS-------------------------------------------------->
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    if (!users) {
      return next(new ErrorHandler("Can't get users", 400));
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler("Can't get users", 400));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const user = await User.findById(id);
    // console.log(user)
    if (!user) {
      return next(new ErrorHandler("Invalid Id or User doesn't exist", 400));
    }
    await user.deleteOne();
    return res.status(200).json({
      success: true,
      message: `User deleted`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error deleting user", 400));
  }
};

//<--------------------------------------FOR PRODUCTS------------------------------------------------>
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
      photo: photo?.path,
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
    const user = await User.findById(id);
    // console.log(user)
    if (!user) {
      return next(new ErrorHandler("Invalid Id or User doesn't exist", 400));
    }
    await user.deleteOne();
    return res.status(200).json({
      success: true,
      message: `User deleted`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error deleting user", 400));
  }
};
