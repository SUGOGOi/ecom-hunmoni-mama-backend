import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
