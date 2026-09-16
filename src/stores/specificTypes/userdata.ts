// To parse this data:
//
//   import { Convert, User } from "./file";
//
//   const user = Convert.toUser(json);

export type Userdata = {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  first_name: string;
  last_name: string;
  phone?: string;
  second_phone?: string;
  role: Role;
  cart: Cart;
  wishlist: Cart;
  user_payments: UserPayment[];
  user_addresses: UserAddress[];
  reviews: Review[];
  // avatar: Avatar;
  order_details: Cart[];
};

export type Avatar = {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  provider_metadata: null;
  createdAt: Date;
  updatedAt: Date;
};

export type Formats = {
  thumbnail: Medium;
  small: Medium;
  medium: Medium;
};

export type Medium = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string;
  width: number;
  height: number;
  size: number;
  url: string;
};

export type Cart = {
  id: number;

  order_notes: string;
  createdAt: Date;

  updatedAt: Date;
  publishedAt: Date;
  total?: number;
};

export type Review = {
  allowed: boolean;
  id: number;
  title: string;
  description: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
};

export type Role = {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserAddress = {
  id: number;
  address1: string;
  address2: string;
  state: string;
  city: string;
  country: string;
  postal_code: string;
  mobile: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
};

export type UserPayment = {
  id: number;
  payment_type: string;
  cardholder_name: string;
  card_number: string;
  expiration_month: string;
  expiration_year: string;
  cvv: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
};
