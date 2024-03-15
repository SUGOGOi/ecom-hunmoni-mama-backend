import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { myCahe } from "../app.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { Order } from "../models/orderModel.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboradStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let stats;
    let count;
    if (myCahe.has("admin-stats")) {
      stats = JSON.parse(myCahe.get("admin-stats")!);
    } else {
      const today = new Date();
      const sixMonthAgo = new Date();

      sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

      const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      };

      const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      };

      const thisMonthProductsPromise = await Product.find({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      });
      const lastMonthProductsPromise = await Product.find({
        createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      });

      const thisMonthOrdersPromise = await Order.find({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      });
      const lastMonthOrdersPromise = await Order.find({
        createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      });

      const thisMonthUsersPromise = await User.find({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      });
      const lastMonthUsersPromise = await User.find({
        createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      });

      const lastSixMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: sixMonthAgo,
          $lte: today,
        },
      });

      const [
        thisMonthProducts,
        thisMonthOrders,
        thisMonthUsers,
        lastMonthProducts,
        lastMonthOrders,
        lastMonthUsers,
        productsWithCategory,
        userCount,
        allOrders,
        lastSixMonthOrders,
        categories,
        lastFiveOrders,
        maleUser,
      ] = await Promise.all([
        thisMonthProductsPromise,
        thisMonthOrdersPromise,
        thisMonthUsersPromise,
        lastMonthProductsPromise,
        lastMonthOrdersPromise,
        lastMonthUsersPromise,
        Product.find({}).select("category").select("stock"),
        User.countDocuments(),
        Order.find({}).select("total"),
        lastSixMonthOrdersPromise,
        Product.distinct("category"),
        Order.find({})
          .sort({ createdAt: -1 })
          .limit(5)
          .select("user")
          .select("total")
          .populate("user", "name"),
        User.find({ gender: "male" }),
      ]);

      const thisMonthRevenue = thisMonthOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );

      const lastMonthRevenue = lastMonthOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );

      const changePercent = {
        revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
        product: calculatePercentage(
          thisMonthProducts.length,
          lastMonthProducts.length
        ),
        order: calculatePercentage(
          thisMonthOrders.length,
          lastMonthOrders.length
        ),
        user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      };

      const revenue = allOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );

      count = {
        revenue: revenue,
        user: userCount,
        product: productsWithCategory.length,
        order: allOrders.length,
      };

      const orderMonthCounts = new Array(6).fill(0);
      const orderMonthRevenu = new Array(6).fill(0);

      lastSixMonthOrders.forEach((order) => {
        const createDate = order.createdAt;
        const monthDiff = today.getMonth() - createDate.getMonth();
        if (monthDiff < 6) {
          orderMonthCounts[6 - monthDiff - 1] =
            orderMonthCounts[6 - monthDiff - 1] + 1;
          orderMonthRevenu[6 - monthDiff - 1] =
            orderMonthRevenu[6 - monthDiff - 1] + order.total;
        }
      });

      const categoryWiseCount: Record<string, number>[] = [];
      let allTotalStocks = 0;

      productsWithCategory.forEach((i) => {
        allTotalStocks = allTotalStocks + i.stock;
      });
      console.log(allTotalStocks);

      let count2 = 0;
      categories.forEach((cat) => {
        productsWithCategory.map((i) => {
          if (cat === i.category) {
            categoryWiseCount.push({
              [cat]: Math.round(((count2 + i.stock) / allTotalStocks) * 100),
            });
          }
        });
        count2 = 0;
      });

      const maleCount = maleUser.length;
      const femaleCount = userCount - maleCount;
      const genderRatio: Record<string, number>[] = [
        {
          male: maleCount,
          famale: femaleCount,
        },
      ];

      stats = {
        changePercent: changePercent,
        chart: {
          orders: orderMonthCounts,
          revenue: orderMonthRevenu,
        },
        count,
        categoryWiseCount,
        genderRatio,
        lastFiveOrders,
      };

      myCahe.set("admin-stats", JSON.stringify(stats));
    }

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
};
export const getDashboradBar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
};
export const getDashboradPie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
};
export const getDashboradLine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
};
