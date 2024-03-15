import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import { getDashboradBar, getDashboradLine, getDashboradPie, getDashboradStats, } from "../controllers/statsControllers.js";
const app = express.Router();
app.get("/stats", isAdmin, getDashboradStats);
app.get("/line", isAdmin, getDashboradLine);
app.get("/bar", isAdmin, getDashboradBar);
app.get("/pie", isAdmin, getDashboradPie);
export default app;
