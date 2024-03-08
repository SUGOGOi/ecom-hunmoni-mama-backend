import express from "express";
import { getLatestProducts, getSingleProduct, } from "../controllers/productContollers.js";
const app = express.Router();
app.get("/latestproduct", getLatestProducts);
//dynamic id
app.get("/:id", getSingleProduct);
export default app;
