"use client";
import { CartStore } from "./cartStore";
import { UserDropStore } from "./userDropStore";

import React, { createContext } from "react";
import { userStore } from "./userStore";
import { SideBarStore } from "./sidebarStore";
import { ProductsStore } from "./productsStore";
import { CartSidebarStore } from "./cartSidebarStore";
import { FilterSidebarStore } from "./filterSidebarStore";
import { ProductsView } from "./productsViewStore";
import { SearchBoxStore } from "./searchBoxStore";
import { WishListStore } from "./wishListStore";
import { AdsSliderStore } from "./adsStore";
import { CategoriesStore } from "./categoriesStore";
import { ColorsStore } from "./colorsStore";
import { LoginFormStore } from "./loginFormStore";
import { RegisterFormStore } from "./registerFormStore";
import { userWishListStore } from "./userWishlist";
import { OrdersStore } from "./ordersStore";
import { UserAddressesStore } from "./userAddressesStore";
import { AddressModalStore } from "./addressModalStore";
import { EditProfileModalStore } from "./editProfileModalStore";
import { FastAdsStore } from "./fastAdsStore";
import { FiltersDropMenuStore } from "./filtersDropMenu";
import PaymentStore from "./paymentStore";

// cart store instance

const cartProducts = new CartStore();

// userDrop store instance

const userDropInstance = new UserDropStore();

// user information store

const userStoreInstance = new userStore();

// sidebar state store

const sidebarInstance = new SideBarStore();

// cart sidebar state store

const cartSidebarInstance = new CartSidebarStore();

// cart sidebar state store

const filterSidebarInstance = new FilterSidebarStore();

// search box state store

const searchBoxInstance = new SearchBoxStore();

// products store

const allProducts = new ProductsStore();

// products view style store

const productsViewStyle = new ProductsView();

// wish list  store

const wishlistProducts = new WishListStore();

// slider ads  store

const adsInstance = new AdsSliderStore();

// products categories store

const categoriesInstance = new CategoriesStore();

// products colors store

const colorsInstance = new ColorsStore();

// register form store

const registerFormInstance = new RegisterFormStore();

// login form store

const loginFormInstance = new LoginFormStore();

// user wishlist store

const userWishlistInstance = new userWishListStore();

// user orders store

const userOrdersInstance = new OrdersStore();

// user addresses store

const userAddressesInstance = new UserAddressesStore();

// address modal store

const addressModalInstance = new AddressModalStore();

// selection address modal store

const selectionAddressModalInstance = new AddressModalStore();

// edit profile modal store

const editProfileModalInstance = new EditProfileModalStore();

// fast ads store

const fastAdsInstance = new FastAdsStore();

// fast ads store

const filtersDropMenuInstance = new FiltersDropMenuStore();

// payment store

const paymentInstance = new PaymentStore();

// ==========================================================
// this object is for all stores that will for all states

export const store = {
  cart: cartProducts,
  userDrop: userDropInstance,
  user: userStoreInstance,
  sidebar: sidebarInstance,
  cartSidebar: cartSidebarInstance,
  products: allProducts,
  filter: filterSidebarInstance,
  viewStyle: productsViewStyle,
  searchBox: searchBoxInstance,
  wishlist: wishlistProducts,
  ads: adsInstance,
  categories: categoriesInstance,
  colors: colorsInstance,
  registerForm: registerFormInstance,
  loginForm: loginFormInstance,
  userWishlist: userWishlistInstance,
  userOrders: userOrdersInstance,
  userAddresses: userAddressesInstance,
  addressModal: addressModalInstance,
  selectionAddressModal: selectionAddressModalInstance,
  profileModal: editProfileModalInstance,
  fastAds: fastAdsInstance,
  filtersDrop: filtersDropMenuInstance,
  payment: paymentInstance,
};

// Create the StoreContext here to avoid circular dependency
export const StoreContext = createContext(store);

interface indexChildren {
  children: React.JSX.Element;
}

// store context provider

const StoreContextProvider = ({ children }: indexChildren) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default StoreContextProvider;
