import express from "express";
const app = express.Router();
app.get("/stats");
app.get("/line");
app.get("/bar");
app.get("/pie");
export default app;
