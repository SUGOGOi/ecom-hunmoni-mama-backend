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

export interface NewProductRequestBody {
  product_name: string;
  photo: string;
  stock: number;
  category: string;
  review: {
    review_photo: string;
    user: string;
    createdAt: Date;
    rating: number;
  };
  description: string;
  price: number;
}

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  page?: string;
  sort?: string;
};

export interface BaseQuery {
  product_name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}

export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
};

export type orderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
  category: string;
};

export type shippingInfo = {
  address: string;
  city: string;
  state: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: shippingInfo;
  user: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  shippingCharges: number;
  orderItems: orderItemType[];
}
