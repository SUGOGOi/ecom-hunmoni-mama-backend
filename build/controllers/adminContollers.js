import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/userModel.js";
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        if (!users) {
            return next(new ErrorHandler("Can't get users", 400));
        }
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new ErrorHandler("Can't get users", 400));
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const user = await User.findById(id);
        // console.log(user)
        if (!user) {
            return next(new ErrorHandler("Invalid Id or User doesn't exist", 400));
        }
        await user.deleteOne();
        return res.status(200).json({
            success: true,
            message: `User deleted`
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler("Error deleting user", 400));
    }
};
//<--------------------------------------FOR PRODUCTS------------------------------------------------>
export const newProduct = (req, res, next) => {
    try {
    }
    catch (error) {
        return next(new ErrorHandler("Internal server error", 500));
    }
};
