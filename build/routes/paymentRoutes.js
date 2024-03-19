import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import { applyCoupon, deleteCoupon, getAllCoupons, newCouponCreate, newPayment, } from "../controllers/paymentControllers.js";
const app = express.Router();
//stripe
app.post("/create", newPayment);
//coupon
app.get("/all-coupons", isAdmin, getAllCoupons);
app.post("/coupon-new", isAdmin, newCouponCreate);
app.delete("/delete-coupon", isAdmin, deleteCoupon);
app.get("/apply-coupon", applyCoupon);
export default app;
