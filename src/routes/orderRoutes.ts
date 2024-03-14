import express from "express";

import { isAdmin } from "../middlewares/auth.js";
import {
  allOrders,
  cancelOrder,
  myOrders,
  newOrder,
  orderDetails,
  specificOrders,
  updateOrderStatus,
} from "../controllers/orderControllers.js";

const app = express.Router();

app.post("/new", newOrder);
app.get("/my-orders", myOrders);
app.get("/all-orders", isAdmin, allOrders);
app.get("/specific", isAdmin, specificOrders);

//<=======================FOR USER========================>//
app.get("/order-details/:_id", orderDetails);
app.delete("/order-cancel/:_id", cancelOrder);

//<======================FOR ADMIN======================>//
app.put("/update-order/:_id", isAdmin, updateOrderStatus);
app.delete("/admin-order-cancel/:_id", isAdmin, cancelOrder);

export default app;
