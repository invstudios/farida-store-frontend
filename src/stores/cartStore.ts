import { makeAutoObservable, runInAction } from "mobx";

import { cartProductType } from "./specificTypes/cartProductType";
import Cookies from "js-cookie";
import { CartItem, UserCart } from "./specificTypes/userCartType";
import { isUserLoggedIn } from "@/functions/credentials";
import { getPriceAfterDiscount } from "@/functions/getPriceAfterDiscount";
import { userCartProductType } from "./specificTypes/userCartProductType";

export class CartStore {
  productsCount: number = 0;
  isCartMenuDisplayed: boolean = false;
  cartProducts: cartProductType[] = [];
  totalPrice: number = 0;
  userCart: UserCart = {} as UserCart;

  userCartItems: userCartProductType[] = [];

  constructor() {
    makeAutoObservable(this);

    // initialized values
  }

  // get all carts products

  getAllCartItems() {
    if (isUserLoggedIn()) {
      this.getUserCartItems();
    } else {
      this.getLocalCartProducts();
    }
  }

  // get all local carts products

  getLocalCartProducts() {
    if (typeof window === 'undefined') return;

    const parseCart = JSON.parse(
      sessionStorage.getItem("cart") ?? "[]"
    ) as cartProductType[];

    runInAction(() => {
      this.productsCount = parseCart.length;
      this.cartProducts = parseCart;
    });

    this.getTotalPrice();
  }

  // gettting user cart items

  getUserCartItems = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/users/me?populate[cart][populate][cart_items][populate][product][populate]=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("credentials")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data): void => {
        // console.log("this is user cart items data : ", data);

        runInAction(() => {
          this.userCart = data.cart;
        });

        let itemsOfUserCart: userCartProductType[] = [];
        data.cart.cart_items.map((item: CartItem) => {
          // console.log(
          //   `this is porduct object of product ${item.product.id} : `,
          //   item.product
          // );
          const userCartItem: userCartProductType = {
            cartItemId: item.id,
            id: item.product.id,
            imgSrc: `${process.env.NEXT_PUBLIC_HOST}${item.product.thumbnail.url}`,
            title: item.product.title,
            slug: item.product.slug,
            description: item.product.description,
            price: getPriceAfterDiscount(
              item.product.discount
                ? item.product.discount.discount_percent
                : 0,
              item.product.price
            ),
            quantity: item.quantity,
            localizatons: {
              title: item.product.localizations[0].title,
              description: item.product.localizations[0].description,
              slug: item.product.localizations[0].slug,
            },
          };

          itemsOfUserCart.push(userCartItem);
        });

        runInAction(() => {
          this.userCartItems = itemsOfUserCart;
          this.productsCount = itemsOfUserCart.length;
        });

        // console.log("this is user cart items ", itemsOfUserCart);
        this.getTotalPrice();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // adding product to cart

  addProduct = (activeProduct: cartProductType) => {
    if (typeof window === 'undefined') return;

    let allAddedProducts: cartProductType[] = JSON.parse(
      sessionStorage.getItem("cart") ?? "[]"
    );

    const productWasFounded = allAddedProducts.find((p) => {
      return p.id === activeProduct.id;
    });

    const newPoduct: cartProductType = { ...activeProduct };

    !productWasFounded && allAddedProducts.push(newPoduct);

    sessionStorage.setItem("cart", JSON.stringify(allAddedProducts));
    this.productsCount = allAddedProducts.length;
    this.cartProducts = allAddedProducts;
    this.getTotalPrice();
  };

  // delete product from cart

  deleteProduct = (productId: number) => {
    if (typeof window === 'undefined') return;

    let allCartProducts: cartProductType[] = JSON.parse(
      sessionStorage.getItem("cart") ?? "[]"
    );

    const filteredProducts = allCartProducts.filter((product) => {
      return product.id !== productId;
    });

    sessionStorage.setItem("cart", JSON.stringify(filteredProducts));

    this.productsCount = filteredProducts.length;
    this.cartProducts = filteredProducts;
    this.getTotalPrice();
  };

  // delete all products from cart

  deleteAllProducts = () => {
    if (typeof window === 'undefined') return;

    sessionStorage.removeItem("cart");

    this.productsCount = 0;
    this.cartProducts = [];
    this.totalPrice = 0;
  };

  // is founded in the cart

  isInCart(productId: number) {
    if (typeof window === 'undefined') return undefined;

    const allCartProducts: cartProductType[] = JSON.parse(
      sessionStorage.getItem("cart") ?? "[]"
    );

    const founded = allCartProducts.find((product) => {
      return product.id === productId;
    });

    return founded;
  }

  isInUserCart(productId: number) {
    const founded = this.userCartItems.find((product) => {
      return product.id === productId;
    });

    // console.log("this product founded : ", founded);

    return founded;
  }

  // get total products prices

  getTotalPrice() {
    this.totalPrice = 0;

    let sum = 0;

    if (Cookies.get("credentials")) {
      this.userCartItems.forEach((product) => {
        sum = sum + product.price * product.quantity;
      });
    } else {
      this.cartProducts.forEach((product) => {
        sum = sum + product.price * product.quantity;
      });
    }

    this.totalPrice = sum;
  }

  // change the quantity of the cart product

  changeQuantity(productId: number, newQuantity: number) {
    if (typeof window === 'undefined') return;

    const parsedCart: cartProductType[] = JSON.parse(
      sessionStorage.getItem("cart") ?? "[]"
    );

    const editedCart = parsedCart.map((product) => {
      if (product.id === productId) {
        return { ...product, quantity: newQuantity };
      } else {
        return product;
      }
    });

    sessionStorage.setItem("cart", JSON.stringify(editedCart));
    this.cartProducts = editedCart;
    this.productsCount = editedCart.length;
    this.getTotalPrice();
  }

  // adding local cart to user cart

  // display cart menu

  displayCartMenu = () => {
    this.isCartMenuDisplayed = true;
  };

  // hide cart menu

  hideCartMenu = () => {
    this.isCartMenuDisplayed = false;
  };

  // set states for cart class

  set setProductsCount(val: number) {
    this.productsCount = val;
  }

  set setUserCartItems(val: userCartProductType[]) {
    this.userCartItems = val;
  }
}
