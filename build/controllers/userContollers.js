import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/utility-class.js";
export const loginUser = async () => { };
export const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const user = await User.findById(id);
        // console.log(user)
        if (!user) {
            return next(new ErrorHandler("Invalid Id or User doesn't exist", 400));
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler("Error! can't get user", 400));
    }
};
