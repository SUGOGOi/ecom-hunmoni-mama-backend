import express from "express";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getLatestProducts,
  getSearchProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/productContollers.js";
import { isAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.get("/latestproduct", getLatestProducts);
app.get("/allcategories", getAllCategories);
app.get("/search", getSearchProducts); //filter
app.post("/newproduct", isAdmin, singleUpload, newProduct);
app.get("/allproducts", isAdmin, getAdminProducts);

//dynamic id
app.get("/:id", getSingleProduct);
app.put("/:id", isAdmin, singleUpload, updateProduct);
app.delete("/:id", isAdmin, deleteProduct);

export default app;
