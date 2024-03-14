import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/userModel.js";
export const isAdmin = async (req, res, next) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            return next(new ErrorHandler("Login First", 401));
        }
        const user = await User.findById(_id);
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
