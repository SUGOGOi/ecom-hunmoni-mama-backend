import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";

export const newOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
};
