import express from "express";
import { getSingleProduct} from "../controllers/productContollers.js";

const app = express.Router();



//dynamic id
app.get("/:id", getSingleProduct);

export default app;