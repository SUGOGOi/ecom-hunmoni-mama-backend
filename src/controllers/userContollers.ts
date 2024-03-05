import { Request,Response,NextFunction } from "express"
import { User } from "../models/userModel.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = async (req: Request<{}, {}, NewUserRequestBody>, res: Response, next: NextFunction) => {
    try {
        const { name, email, phno, photo, password, _id, dob, role, gender } = req.body;
        
        var user = await User.findOne({ email })
        if (user) {
            return next(new ErrorHandler("User already exist", 400))
        }
        user = await User.create({
            name, email, phno, photo, password, _id, dob, role, gender
        });
        
        return res.status(201).json({
            success: true,
            message: `Welcome ${user.name}`
        })

    } catch (error) {
        console.log(error)
        return next(new ErrorHandler("", 200))
    }
    
};

export const loginUser = async () => {
    
};
