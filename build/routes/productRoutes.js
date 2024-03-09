import express from "express";
import { deleteProduct, getAllCategories, getCategoryWiseProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct, } from "../controllers/productContollers.js";
import { isAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
app.get("/latestproduct", getLatestProducts);
app.get("/getallcategories", getAllCategories);
app.get("/categorywise", getCategoryWiseProducts);
app.post("/newproduct", isAdmin, singleUpload, newProduct);
//dynamic id
app.get("/:id", getSingleProduct);
app.put("/:id", isAdmin, singleUpload, updateProduct);
app.delete("/:id", isAdmin, deleteProduct);
export default app;
