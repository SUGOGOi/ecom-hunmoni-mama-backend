import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/userModel.js";
import { rm } from "fs";
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, phno, password, _id, dob, role, gender } = req.body;
        const photo = req.file;
        console.log(photo);
        if (!photo)
            return next(new ErrorHandler("Upload photo", 400));
        if (!_id || !name || !email || !password || !dob || !gender) {
            rm(photo.path, () => {
                console.log(`${photo.originalname} deleted`);
            });
            return next(new ErrorHandler("Please enter all the fields", 400));
        }
        var user = await User.findOne({ email });
        if (user) {
            rm(photo.path, () => {
                console.log(`${photo.originalname} deleted`);
            });
            return next(new ErrorHandler("User already exist", 400));
        }
        user = await User.create({
            name,
            email,
            phno,
            photo: photo.path,
            password,
            _id,
            dob,
            role,
            gender,
        });
        return res.status(201).json({
            success: true,
            message: `Welcome ${user.name}`,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler("", 200));
    }
};
