import express from "express";

import { isAdmin } from "../middlewares/auth.js";
import { newOrder } from "../controllers/orderControllers.js";

const app = express.Router();

app.post("/new", newOrder);

export default app;
