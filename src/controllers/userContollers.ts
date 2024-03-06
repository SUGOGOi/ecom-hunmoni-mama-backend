import { Request,Response,NextFunction } from "express"
import { User } from "../models/userModel.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = async (req: Request<{}, {}, NewUserRequestBody>, res: Response, next: NextFunction) => {
    try {
        const { name, email, phno, photo, password, _id, dob, role, gender } = req.body;

        if (!_id || !name || !email || !phno || !photo || !password || !dob || !gender) {
            return next(new ErrorHandler("Please enter all the fields",400))  
        }
        
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

export const getUser = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const user = await User.findById( id );
        // console.log(user)

        if (!user) {
            return next(new ErrorHandler("Invalid Id or User doesn't exist",400))
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        return next(new ErrorHandler("Error! can't get user",400))
    }
}
