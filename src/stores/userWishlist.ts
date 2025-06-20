import { makeAutoObservable, runInAction } from "mobx";
import { userCartProductType } from "./specificTypes/userCartProductType";
import { isUserLoggedIn } from "@/functions/credentials";
import { UserWishlist, WishlistItem } from "./specificTypes/userWishlistType";
import { getPriceAfterDiscount } from "@/functions/getPriceAfterDiscount";
import { userWishlistProductType } from "./specificTypes/wishlistProductType";
import { getAverageRatings } from "@/functions/getAverageRatings";

export class userWishListStore {
  userWishlist: UserWishlist = {} as UserWishlist;
  userWishlistProducts: userWishlistProductType[] = [];
  userWishlistProductsCount: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  getUserWishlistItems = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/users/me?populate[wishlist][populate][wishlist_items][populate][product][populate]=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data): void => {
        
        runInAction(() => {
          this.userWishlist = data.wishlist;
        });

        let itemsOfUserWishlist: userWishlistProductType[] = [];

        data?.wishlist?.wishlist_items?.map((item: WishlistItem) => {
          const userWishListItem: userWishlistProductType = {
            wishlistItemId: item.id,
            id: item.product.id,
            imgSrc: `${process.env.NEXT_PUBLIC_HOST}${item.product?.thumbnail?.url}`,
            title: item.product.title,
            slug: item.product.slug,
            description: item.product.description,
            price: getPriceAfterDiscount(
              item.product.discount
                ? item.product.discount.discount_percent
                : 0,
              item.product.price
            ),
            reviews: item.product.reviews,
            localization: {
              title: item.product.localizations[0].title,
              desscription: item.product.localizations[0].description,
              slug: item.product.localizations[0].slug,
            },
          };

          itemsOfUserWishlist.push(userWishListItem);
        });

        runInAction(() => {
          //   this.userCartItems = itemsOfUserCart;
          //     this.productsCount = itemsOfUserCart.length;

          this.userWishlistProducts = itemsOfUserWishlist;
          this.userWishlistProductsCount = itemsOfUserWishlist.length;
        });

      })
      .catch((err) => {
      });
  };

  sortUserWishlistItems(filter: string) {
    let sortedWishlist: userWishlistProductType[] = [];
    if (filter === "A-Z") {
      sortedWishlist = this.userWishlistProducts.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    } else if (filter === "Prices Up") {
      sortedWishlist = this.userWishlistProducts.sort((a, b) => {
        return a.price - b.price;
      });
    } else if (filter === "Prices Down") {
      sortedWishlist = this.userWishlistProducts.sort((a, b) => {
        return b.price - a.price;
      });
    } else if (filter === "Rating") {
      let itemsAverageRatings: {
        itemId: number | string;
        averageRating: number;
        totalRatings: number;
      }[] = [];

      this.userWishlistProducts.forEach((item) => {
        const itemAverageRating = getAverageRatings(item.reviews);

        itemsAverageRatings.push({
          averageRating: itemAverageRating,
          itemId: item.id,
          totalRatings: item.reviews.length,
        });
      });

      // this step to sort the items  according to average ratings

      // itemsAverageRatings.sort((a, b) => {
      //   return b.averageRating - a.averageRating;
      // });

      // this step to sort the items  mixed with average ratings and total ratings

      itemsAverageRatings.sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          // Sort by average rating in descending order
          return b.averageRating - a.averageRating;
        } else {
          // If average rating is equal, sort by total ratings in descending order
          return b.totalRatings - a.totalRatings;
        }
      });

      // this step to sort the items again according to total ratings

      // itemsAverageRatings.sort((a, b) => {
      //   return b.totalRatings - a.totalRatings;
      // });

      itemsAverageRatings.forEach((item) => {
        this.userWishlistProducts.forEach((product) => {
          if (product.id === item.itemId) {
            sortedWishlist.push(product);
          }
        });
      });
    }

    runInAction(() => {
      if (filter) {
        this.userWishlistProducts = sortedWishlist;
      } else {
        this.getUserWishlistItems();
      }
    });
  }

  addProductToUserWishlist = async (productId: string | number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/wishlist-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
        body: JSON.stringify({
          data: {
            product: productId.toString(),

            wishlist: this?.userWishlist?.id,
          },
        }),
      }
    );

    return response.ok;
  };

  removeProductFromUserWishlistByProductId = async (
    productId: string | number
  ) => {
    const wishlistItem = this.isFoundedInWishList(productId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/wishlist-items/${wishlistItem?.wishlistItemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
      }
    );

    return response.ok;
  };

  isFoundedInWishList = (productId: number | string) => {
    const founded = this.userWishlistProducts.find((product) => {
      return product.id === productId;
    });
    return founded;
  };

  resetAllStates() {
    this.userWishlist = {} as UserWishlist;
    this.userWishlistProducts = [];
    this.userWishlistProductsCount = 0;
  }

  set setUserWishlistProductCount(val: number) {
    this.userWishlistProductsCount = val;
  }
}
