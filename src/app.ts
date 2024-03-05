import express from "express";
import userRoutes from "./routes/userRoutes.js"
import {config} from "dotenv"
import { connectDB } from "./config/DBconfig.js";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error.js";

const port = 4000;

connectDB();

const app = express();

config({
    path:"./config/config.env"
})

app.use(express.json())
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get("/", (req, res) => {
    res.send("API working")
})

//using routes
app.use("/api/v1/user", userRoutes);


//error middleware
app.use(errorMiddleware);


app.listen(port, () => {
    console.log(`express is working port:${port}`)
})