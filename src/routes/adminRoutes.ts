import express from "express";
import { deleteUser, getAllUsers, newProduct } from "../controllers/adminContollers.js";
import { isAdmin } from "../middlewares/auth.js";

const app = express.Router();

app.get("/allusers", isAdmin, getAllUsers);
app.post("/new", newProduct);

//delete user
app.delete("/:id",isAdmin, deleteUser);



export default app;