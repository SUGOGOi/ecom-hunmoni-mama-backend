import ErrorHandler from "../utils/utility-class.js";
export const newOrder = async (req, res, next) => {
    try {
    }
    catch (error) {
        return next(new ErrorHandler("Internal server error", 500));
    }
};
