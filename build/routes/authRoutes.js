import express from "express";
import { registerUser } from "../controllers/authControllers.js";
const app = express();
app.post("/register", registerUser);
export default app;
