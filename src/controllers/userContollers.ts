import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/utility-class.js";

export const loginUser = async () => {};

export const getUser = async (
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

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler("Error! can't get user", 400));
  }
};

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
