import { makeAutoObservable } from "mobx";
import { userWishlistProductType } from "./specificTypes/wishlistProductType";

export class WishListStore {
  items: userWishlistProductType[] = [];
  itemsCount: number = 0;

  constructor() {
    makeAutoObservable(this);
    // Only initialize from localStorage on client side
    if (typeof window !== 'undefined') {
      this.getAllWishlistProducts();
    }
  }

  addToWishlist(addedProduct: userWishlistProductType) {
    if (typeof window === 'undefined') return;

    const allWishlistProducts: userWishlistProductType[] = JSON.parse(
      localStorage.getItem("wishlist") ?? "[]"
    );

    const productWasFounded = allWishlistProducts.find((product) => {
      return product.id === addedProduct.id;
    });

    if (!productWasFounded) {
      allWishlistProducts.push(addedProduct);
      this.setWishlist(allWishlistProducts);
    }
  }

  removeFromWishlist(productId: number) {
    if (typeof window === 'undefined') return;

    const allWishlistProducts: userWishlistProductType[] = JSON.parse(
      localStorage.getItem("wishlist") ?? "[]"
    );

    const filteredProducts = allWishlistProducts.filter((product) => {
      return product.id !== productId;
    });

    this.setWishlist(filteredProducts);
  }

  removeAllFromWishlist() {
    if (typeof window === 'undefined') return;

    localStorage.setItem("wishlist", "[]");
    this.items = [];
    this.itemsCount = 0;
  }

  isInWishlist(productId: number) {
    if (typeof window === 'undefined') return undefined;

    const allWishlistProducts: userWishlistProductType[] = JSON.parse(
      localStorage.getItem("wishlist") ?? "[]"
    );

    const founded = allWishlistProducts.find((product) => {
      return productId === product.id;
    });

    return founded;
  }

  // reused functions

  getAllWishlistProducts() {
    if (typeof window === 'undefined') return;

    const allWishlistProducts: userWishlistProductType[] = JSON.parse(
      localStorage.getItem("wishlist") ?? "[]"
    );
    this.items = allWishlistProducts;
    this.itemsCount = allWishlistProducts.length;
  }

  setWishlist(newValue: userWishlistProductType[]) {
    if (typeof window === 'undefined') return;

    localStorage.setItem("wishlist", JSON.stringify(newValue));
    this.items = newValue;
    this.itemsCount = newValue.length;
  }
}
