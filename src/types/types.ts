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


export interface NewProductRequestBody{
    product_name: string;
    photo: string;
    stock: number;
    category: string;
    review: {
        review_photo: string,
        user: string,
        createdAt: Date,
        rating: number
    };
    
}