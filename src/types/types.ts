export interface NewUserRequestBody {
    _id: string;
    name: string;
    email: string;
    photo: string;
    phno: string;
    password: string;
    role: "admin" | "user";
    gender: string;
    dob: Date;
}