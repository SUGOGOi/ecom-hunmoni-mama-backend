import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/userModel.js";
export const isAdmin = async (req, res, next) => {
    try {
        const { id } = req.query;
        if (!id) {
            return next(new ErrorHandler("Login First", 401));
        }
        const user = await User.findById(id);
        if (!user) {
            return next(new ErrorHandler("Invalid ID or User donesn't exist", 401));
        }
        if (user.role != "admin") {
            return next(new ErrorHandler("Only admin can access this resources!", 401));
        }
        next();
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler("Only admin can access this resources!", 401));
    }
};
