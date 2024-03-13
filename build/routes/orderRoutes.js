import express from "express";
import { newOrder } from "../controllers/orderControllers.js";
const app = express.Router();
app.post("/new", newOrder);
export default app;
