import mongoose, { Schema } from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  phno: string;
  password: string;
  role: "admin" | "user";
  gender: string;
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  //virtual attribute
  age: number;
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Signup fail"],
    },
    name: {
      type: String,
      required: [true, "Enter your name"],
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      unique: [true, "Email already exist"],
      validate: validator.isEmail,
    },
    photo: {
      type: String,
      required: [true, "Signup fail"],
    },
    phno: {
      type: String,
      required: [true, "Enter your phone number"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Enter password"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      required: [true, "Enter your gender"],
    },
    dob: {
      type: Date,
      required: [true, "Enter Date of birth"],
    },
  },
  { timestamps: true }
);

userSchema.virtual("age").get(function () {
  const today = new Date();

  const dob: any = this.dob;
  let age: any = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() == dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age = age - 1;
  }

  return age;
});

export const User = mongoose.model<IUser>("user", userSchema);
