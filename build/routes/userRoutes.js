import express from "express";
import { deleteUser, getAllUsers, getUser, } from "../controllers/userContollers.js";
import { isAdmin } from "../middlewares/auth.js";
const app = express.Router();
app.get("/allusers", isAdmin, getAllUsers);
//dynamic id
app.get("/:id", getUser);
app.delete("/:id", isAdmin, deleteUser);
export default app;
