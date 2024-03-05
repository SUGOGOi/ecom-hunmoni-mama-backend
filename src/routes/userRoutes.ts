import express from "express";
import { loginUser, newUser } from "../controllers/userContollers.js";
const app = express.Router();

app.post("/new", newUser);
app.post("/login", loginUser);

export default app;