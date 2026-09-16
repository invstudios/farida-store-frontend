import { cartProductType } from "./specificTypes/cartProductType";

export type cartProduct = cartProductType & {
  cartItemId?: number | string;
};