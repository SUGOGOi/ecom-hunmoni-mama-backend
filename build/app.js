import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/DBconfig.js";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error.js";
//importing routes
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const port = 4000;
connectDB();
const app = express();
//config path
config({
    path: "./config/config.env"
});
//aditional middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.get("/", (req, res) => {
    res.send("API working");
});
//using routes
app.use("/api/v1/user", userRoutes);
//admin routes
app.use("/api/v1/admin", adminRoutes);
//error middleware
app.use(errorMiddleware);
//express server
app.listen(port, () => {
    console.log(`express is working port:${port}`);
});
