import express from "express";
import { getUser, loginUser } from "../controllers/userContollers.js";
const app = express.Router();

//dynamic id
app.get("/:id", getUser);

export default app;
