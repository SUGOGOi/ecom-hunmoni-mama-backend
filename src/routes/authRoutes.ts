import express from "express";
import { registerUser } from "../controllers/authControllers.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express();

app.post("/register", singleUpload, registerUser);

export default app;
