import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/DBconfig.js";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import morgan from "morgan";
import Stripe from "stripe";
//<-------------------------------IMPORTING ROUTES--------------------------------->
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
//<--------------------------------CONFIG FILE-------------------------------------->
config({
    path: "./config.env",
});
const port = process.env.PORT || 4000;
const stripKey = process.env.STRIPE_KEY || "";
connectDB();
export const stripe = new Stripe(stripKey);
export const myCahe = new NodeCache(); //cache
const app = express();
//<---------------------------------ADDITIONAL MIDDLEWARES----------------------------->
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.get("/", (req, res) => {
    res.send("API working");
});
//<-------------------------------------USING ROUTES----------------------------------->
app.use("/api/v1/user", userRoutes); //user routes
app.use("/api/v1/product", productRoutes); //products route
app.use("/api/v1/auth", authRoutes); //auth routes
app.use("/api/v1/order", orderRoutes); //order routes
app.use("/api/v1/payment", paymentRoutes); //payment routes
app.use("/api/v1/stats", statsRoutes); //stats routes
//<---------------------------------------STATIC FOLDER-------------------------------->
app.use("/uploads", express.static("uploads"));
//<----------------------------------ERROR MIDDLEWARE----------------------------------->
app.use(errorMiddleware);
//<-----------------------------------EXPRESS SERVER------------------------------------>
app.listen(port, () => {
    console.log(`express is working port:${port}`);
});
