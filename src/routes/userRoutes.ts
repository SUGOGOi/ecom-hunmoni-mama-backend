import express from "express";
import { getUser, loginUser, newUser } from "../controllers/userContollers.js";
const app = express.Router();

app.post("/new", newUser);

//dynamic id
app.get("/:id", getUser);

export default app;