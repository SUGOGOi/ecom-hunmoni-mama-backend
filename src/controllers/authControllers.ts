import { NewUserRequestBody } from "../types/types.js";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/userModel.js";

export const registerUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phno, photo, password, _id, dob, role, gender } =
      req.body;

    if (
      !_id ||
      !name ||
      !email ||
      !phno ||
      !photo ||
      !password ||
      !dob ||
      !gender
    ) {
      return next(new ErrorHandler("Please enter all the fields", 400));
    }

    var user = await User.findOne({ email });
    if (user) {
      return next(new ErrorHandler("User already exist", 400));
    }
    user = await User.create({
      name,
      email,
      phno,
      photo,
      password,
      _id,
      dob,
      role,
      gender,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome ${user.name}`,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("", 200));
  }
};
