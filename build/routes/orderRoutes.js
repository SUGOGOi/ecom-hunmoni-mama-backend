import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import { newOrder } from "../controllers/orderControllers.js";
const app = express.Router();
app.post("/new", newOrder);
app.get("/my-orders", newOrder);
app.get("/all-order", isAdmin, newOrder);
app.get("/specific", isAdmin);
//dynamic id
app.get("/order-details/:id"); //for user
app.delete("/order-cancle/:id"); //for user
app.put("/admin-order/:id");
export default app;
