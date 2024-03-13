import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/DBconfig.js";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import morgan from "morgan";

//<-------------------------------IMPORTING ROUTES--------------------------------->
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

//<--------------------------------CONFIG FILE-------------------------------------->
config({
  path: "./config.env",
});

const port = process.env.PORT || 4000;

connectDB();

//cache
export const myCahe = new NodeCache();

const app = express();

//<---------------------------------ADDITIONAL MIDDLEWARES----------------------------->
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("API working");
});

//<-------------------------------------USING ROUTES----------------------------------->
app.use("/api/v1/user", userRoutes); //user routes
app.use("/api/v1/product", productRoutes); //products route
app.use("/api/v1/auth", authRoutes); //auth routes
app.use("/api/v1/order", orderRoutes); //order routes

//<---------------------------------------STATIC FOLDER-------------------------------->
app.use("/uploads", express.static("uploads"));

//<----------------------------------ERROR MIDDLEWARE----------------------------------->
app.use(errorMiddleware);

//<-----------------------------------EXPRESS SERVER------------------------------------>
app.listen(port, () => {
  console.log(`express is working port:${port}`);
});
