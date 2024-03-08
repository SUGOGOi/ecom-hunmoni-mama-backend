import express from "express";
import { deleteUser, getAllUsers, newProduct, } from "../controllers/adminContollers.js";
import { isAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
app.get("/allusers", isAdmin, getAllUsers);
app.post("/newproduct", isAdmin, singleUpload, newProduct);
//delete user
app.delete("/:id", isAdmin, deleteUser);
export default app;
