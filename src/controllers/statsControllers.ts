import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { myCahe } from "../app.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { Order } from "../models/orderModel.js";
import {
  calculatePercentage,
  getChartData,
  getChartDataProduct,
} from "../utils/features.js";

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
        productOutOfStock,
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
        Product.find({ stock: 0 }).select("product_name"),
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
        let monthDiff = (today.getMonth() - createDate.getMonth() + 12) % 12;
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
        productOutOfStock,
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
    let barCharts;
    const today = new Date();
    const sixMonthAgo = new Date();
    const twelveMonthAgo = new Date();

    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
    twelveMonthAgo.setMonth(sixMonthAgo.getMonth() - 12);
    const lastSixMonthProductsPromise = Product.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    }).select(["stock", "createdAt"]);

    const lastSixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const lastTwelveMonthOrderPromise = Order.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    if (myCahe.has("admin-bar-chart")) {
      barCharts = JSON.parse(myCahe.get("admin-bar-chart")!);
    } else {
      const [lastSixMonthProducts, lastSixMonthUsers, lastTwelveMonthOrders] =
        await Promise.all([
          lastSixMonthProductsPromise,
          lastSixMonthUsersPromise,
          lastTwelveMonthOrderPromise,
        ]);

      const sixMonthProducts = getChartDataProduct({
        length: 6,
        docArr: lastSixMonthProducts,
      });
      const sixMonthUsers = getChartData({
        length: 6,
        docArr: lastSixMonthUsers,
      });
      const twelveMonthOrders = getChartData({
        length: 12,
        docArr: lastTwelveMonthOrders,
      });

      barCharts = {
        sixMonthProducts,
        sixMonthUsers,
        twelveMonthOrders,
      };
      myCahe.set("admin-bar-chart", JSON.stringify(barCharts));
    }
    return res.status(200).json({
      success: true,
      barCharts,
    });
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
    let pieCharts;
    if (myCahe.has("admin-pie-chart")) {
      pieCharts = JSON.parse(myCahe.get("admin-pie-chart")!);
    } else {
      const allOrdersPromise = Order.find({}).select([
        "total",
        "subtotal",
        "tax",
        "shippingCharges",
        "discount",
      ]);

      const [
        processingOrder,
        shippedOrder,
        deliveredOrder,
        productsWithCategory,
        categories,
        allOrders,
        adminCount,
        userCount,
      ] = await Promise.all([
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Product.find({}).select("category").select("stock"),
        Product.distinct("category"),
        allOrdersPromise,
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "user" }),
      ]);

      const orderFulfilment = {
        processingOrder: processingOrder,
        shippedOrder: shippedOrder,
        deliveredOrder: deliveredOrder,
      };

      const categoryWiseCount: Record<string, number>[] = [];
      let allTotalStocks = 0;

      productsWithCategory.forEach((i) => {
        allTotalStocks = allTotalStocks + i.stock;
      });
      console.log(allTotalStocks);

      let count = 0;
      categories.forEach((cat) => {
        productsWithCategory.map((i) => {
          if (cat === i.category) {
            categoryWiseCount.push({
              [cat]: Math.round(((count + i.stock) / allTotalStocks) * 100),
            });
          }
        });
        count = 0;
      });

      const productStock: Record<string, number | string>[] = [];

      let count2 = 0;
      categories.forEach((cat) => {
        productsWithCategory.map((i) => {
          if (cat === i.category) {
            productStock.push({
              [cat]: count2 + i.stock,
            });
          }
        });
        count2 = 0;
      });

      const grossIncome = allOrders.reduce(
        (prev, order) => prev + (order.total || 0),
        0
      );
      const totalDiscount = allOrders.reduce(
        (prev, order) => prev + (order.discount || 0),
        0
      );
      const productionCost = allOrders.reduce(
        (prev, order) => prev + (order.shippingCharges || 0),
        0
      );
      const burnt = allOrders.reduce(
        (prev, order) => prev + (order.tax || 0),
        0
      );
      const marketingCost = Math.round(
        (Number(process.env.MARKET) / 100) * grossIncome
      );

      const netMargin =
        grossIncome - totalDiscount - productionCost - burnt - marketingCost;

      const adminUserRatio = {
        adminCount,
        userCount,
      };

      const revenueDistribution = {
        grossIncome,
        totalDiscount,
        productionCost,
        burnt,
        marketingCost,
        netMargin,
        adminUserRatio,
      };

      pieCharts = {
        orderFulfilment,
        categoryWiseCount,
        productStock,
        revenueDistribution,
      };
      myCahe.set("admin-pie-chart", JSON.stringify(pieCharts));
    }

    return res.status(200).json({
      success: true,
      pieCharts,
    });
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
    let lineCharts;
    const today = new Date();
    const twelveMonthAgo = new Date();

    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 6);
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);
    const lastTwelveMonthProductsPromise = Product.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select(["stock", "createdAt"]);

    const lastTwelveMonthUsersPromise = User.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const lastTwelveMonthOrderPromise = Order.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    if (myCahe.has("admin-line-chart")) {
      lineCharts = JSON.parse(myCahe.get("admin-line-chart")!);
    } else {
      const [
        lastTwelveMonthProducts,
        lastTwelveMonthUsers,
        lastTwelveMonthOrders,
      ] = await Promise.all([
        lastTwelveMonthProductsPromise,
        lastTwelveMonthUsersPromise,
        lastTwelveMonthOrderPromise,
      ]);

      const twelveMonthProducts = getChartDataProduct({
        length: 12,
        docArr: lastTwelveMonthProducts,
      });
      const twelveMonthUsers = getChartData({
        length: 12,
        docArr: lastTwelveMonthUsers,
      });
      const twelveMonthOrders = getChartData({
        length: 12,
        docArr: lastTwelveMonthOrders,
      });

      lineCharts = {
        twelveMonthProducts,
        twelveMonthUsers,
        twelveMonthOrders,
      };
      myCahe.set("admin-line-chart", JSON.stringify(lineCharts));
    }
    return res.status(200).json({
      success: true,
      lineCharts,
    });
  } catch (error) {
    return next(new ErrorHandler("Internal server error", 500));
  }
};
