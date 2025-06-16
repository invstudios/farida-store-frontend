import { makeAutoObservable, runInAction } from "mobx";
import {
  Data,
  Datum,
  strapiProductType,
} from "./specificTypes/strapiProductType";
import { PopulatedReview } from "./specificTypes/targetProductReviewsType";
import { ProductArabicData } from "./specificTypes/productArabicDataType";
// import { ProductArabicData } from "./specificTypes/productArabicDataType";

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export class ProductsStore {
  products: strapiProductType[] = [];
  // sortedProducts:strapiProductType[]=[]
  bestSellerProducts: strapiProductType[] = [];
  saleProducts: strapiProductType[] = [];
  dealProducts: strapiProductType[] = [];

  targetProduct: strapiProductType = {} as strapiProductType;
  targetProductReviews: PopulatedReview[] = [];
  targetProductArabicData: ProductArabicData = {} as ProductArabicData;
  pagination: Pagination = {
    page: 1,
    pageSize: 12,
    pageCount: 1,
    total: 1,
  };

  getMethodOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ?? "",
    },
  };

  // loading states

  productsLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // methods to fetching data from api endpoints

  getAllProducts = async () => {
    runInAction(() => {
      this.productsLoading = true;
    });

    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products?populate[images]=*&populate[thumbnail]=*&populate[category]=*&populate[reviews]=*&populate[discount]=*&populate[localizations]=*&populate[product_inventory]=*&populate[sizes]=*&populate[colors]=*&pagination[page]=${this.pagination.page}&pagination[pageSize]=${this.pagination.pageSize}`,
      this.getMethodOptions
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log("this is the data of the promise we get : ", data);
        runInAction(() => {
          this.products = data.data || [];
          this.pagination = data.meta?.pagination || this.pagination;
          this.productsLoading = false;
        });
      })
      .catch((err) => console.log(err));
  };

  getSingleProduct = async (productId: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/${productId}?populate[images]=*&populate[thumbnail]=*&populate[category]=*&populate[reviews]=*&populate[discount]=*&populate[localizations]=*&populate[product_inventory]=*&populate[sizes]=*&populate[colors]=*`,
      this.getMethodOptions
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(
        //   "this is the data of the promise we get from single product : ",
        //   data
        // );
        runInAction(() => {
          this.targetProduct = data.data;
        });
      })
      .catch((err) => console.log(err));

    await this.getTargetProductsReviews(productId);
    await this.getTargetProductArabicData(productId);
  };

  getTargetProductArabicData = async (productId: string) => {
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/${productId}?populate[localizations]=*`,
        this.getMethodOptions
      );

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      let data = await response.json();

      // Check if data and required properties exist
      if (data?.data?.attributes?.localizations?.data?.[0]) {
        runInAction(() => {
          this.targetProductArabicData = data.data.attributes.localizations.data[0];

          console.log(
            "this is the target products arabic data : ",
            data.data.attributes.localizations.data[0]
          );
        });
      } else {
        console.warn("No Arabic localization data found for product:", productId);
      }
    } catch (error) {
      console.error("Error fetching Arabic product data:", error);
    }
  };

  getTargetProductsReviews = async (productId: string) => {
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/${productId}?populate[reviews][populate]=*`,
        this.getMethodOptions
      );

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      let data = await response.json();

      // Check if data and required properties exist
      if (data?.data?.attributes?.reviews?.data) {
        runInAction(() => {
          this.targetProductReviews = data.data.attributes.reviews.data;

          console.log(
            "this is the target products reviews : ",
            data.data.attributes.reviews.data
          );
        });
      } else {
        console.warn("No reviews data found for product:", productId);
        runInAction(() => {
          this.targetProductReviews = [];
        });
      }
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      runInAction(() => {
        this.targetProductReviews = [];
      });
    }
  };

  getBestSellerProducts = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/?populate[images]=*&populate[thumbnail]=*&populate[category]=*&populate[reviews]=*&populate[discount]=*&populate[localizations]=*&populate[product_inventory]=*&populate[sizes]=*&populate[colors]=*&filters[type][$eq]=best_seller&pagination[page]=${this.pagination.page}&pagination[pageSize]=${this.pagination.pageSize}`,
      this.getMethodOptions
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(
        //   "this is the data of the promise we get from best seller products : ",
        //   data
        // );
        runInAction(() => {
          this.bestSellerProducts = data.data || [];
          this.pagination = data.meta?.pagination || this.pagination;
        });
      })
      .catch((err) => console.log(err));
  };

  getSaleProducts = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/?populate[images]=*&populate[thumbnail]=*&populate[category]=*&populate[reviews]=*&populate[discount]=*&populate[localizations]=*&populate[product_inventory]=*&populate[sizes]=*&populate[colors]=*&filters[type][$eq]=sale&pagination[page]=${this.pagination.page}&pagination[pageSize]=${this.pagination.pageSize}`,
      this.getMethodOptions
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(
        //   "this is the data of the promise we get from sale products : ",
        //   data
        // );
        runInAction(() => {
          this.saleProducts = data.data || [];
          this.pagination = data.meta?.pagination || this.pagination;
        });
      })
      .catch((err) => console.log(err));
  };

  getDealProducts = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/?populate[images]=*&populate[thumbnail]=*&populate[category]=*&populate[reviews]=*&populate[discount]=*&populate[localizations]=*&populate[product_inventory]=*&populate[sizes]=*&populate[colors]=*&filters[type][$eq]=deal&pagination[page]=${this.pagination.page}&pagination[pageSize]=${this.pagination.pageSize}`,
      this.getMethodOptions
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(
        //   "this is the data of the promise we get from deal products : ",
        //   data
        // );
        runInAction(() => {
          this.dealProducts = data.data || [];
          this.pagination = data.meta?.pagination || this.pagination;
        });
      })
      .catch((err) => console.log(err));
  };

  getProductsByFilters = async (
    sortingType: string,
    isSalesOnly: boolean,
    colorName: string,
    minPrice: string,
    maxPrice: string,
    category: string,
    searchQuery: string
    // locale: string
  ) => {
    runInAction(() => {
      this.productsLoading = true;
    });

    if (sortingType !== "rating") {
      interface QueryParams {
        "populate[images]"?: string;
        "populate[thumbnail]"?: string;
        "populate[category]"?: string;
        "populate[reviews]"?: string;
        "populate[discount]"?: string;
        "populate[localizations]"?: string;
        "populate[product_inventory]"?: string;
        "populate[sizes]"?: string;
        "populate[colors]"?: string;
        "pagination[page]"?: number;
        "pagination[pageSize]"?: number;
        sort?: string;
        // Add more filter keys here
        [key: string]: string | number | undefined;
      }

      const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/`;

      const queryParams: QueryParams = {
        "populate[images]": "*",
        "populate[thumbnail]": "*",
        "populate[category]": "*",
        "populate[reviews]": "*",
        "populate[discount]": "*",
        "populate[localizations]": "*",
        "populate[product_inventory]": "*",
        "populate[sizes]": "*",
        "populate[colors]": "*",
        // locale: locale,
      };

      // Add filters first
      if (category) {
        queryParams["filters[category][name][$eq]"] = category.replaceAll(
          "%20",
          " "
        );
      }

      if (colorName.length > 0) {
        queryParams["filters[colors][name][$eq]"] = colorName;
      }

      if (minPrice.length > 0) {
        queryParams["filters[price][$gt]"] = minPrice;
      }

      if (maxPrice.length > 0) {
        queryParams["filters[price][$lt]"] = maxPrice;
      }

      if (isSalesOnly) {
        queryParams["filters[type][$eq]"] = "sale";
      }

      if (searchQuery) {
        queryParams["filters[$or][0][title][$contains]"] = searchQuery;
        queryParams["filters[$or][1][description][$contains]"] = searchQuery;
        queryParams["filters[$or][2][category][name][$contains]"] = searchQuery;
        queryParams["filters[$or][3][colors][name][$contains]"] = searchQuery;
      }

      // Add sort parameter if not empty
      if (sortingType && sortingType.trim() !== "") {
        queryParams.sort = sortingType;
      }

      // Add pagination last
      queryParams["pagination[page]"] = this.pagination.page;
      queryParams["pagination[pageSize]"] = this.pagination.pageSize;

      // Separate populate and other params
      const populateParams = [
        "populate[images]=*",
        "populate[thumbnail]=*",
        "populate[category]=*",
        "populate[reviews]=*",
        "populate[discount]=*",
        "populate[localizations]=*",
        "populate[product_inventory]=*",
        "populate[sizes]=*",
        "populate[colors]=*"
      ].join("&");

      const otherParams = Object.entries(queryParams)
        .filter(([key, value]) => !key.startsWith("populate[") && value !== undefined && value !== "")
        .map(([key, value]) => {
          // Don't encode filter keys to avoid %5B and %5D
          if (key.startsWith('filters[')) {
            return `${key}=${encodeURIComponent(value!)}`;
          }
          return `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`;
        });

      // Join populate with first filter without &, then add other params with &
      const queryString = otherParams.length > 0
        ? populateParams + otherParams[0] + (otherParams.length > 1 ? "&" + otherParams.slice(1).join("&") : "")
        : populateParams;

      const url = `${endpoint}?${queryString}`;

      await fetch(url, this.getMethodOptions)
        .then((res) => res.json())
        .then((data) => {
          runInAction(() => {
            this.products = data.data || [];
            this.pagination = data.meta?.pagination || this.pagination;
            this.productsLoading = false;
          });
        })
        .catch((err) => console.log(err));
    } else {
      interface QueryParams {
        "populate[images]"?: string;
        "populate[thumbnail]"?: string;
        "populate[category]"?: string;
        "populate[reviews]"?: string;
        "populate[discount]"?: string;
        "populate[localizations]"?: string;
        "populate[product_inventory]"?: string;
        "populate[sizes]"?: string;
        "populate[colors]"?: string;
        "pagination[page]"?: number;
        "pagination[pageSize]"?: number;
        //  sort: string;
        // Add more filter keys here
        [key: string]: string | number | undefined;
      }

      const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/`;

      const queryParams: QueryParams = {
        "populate[images]": "*",
        "populate[thumbnail]": "*",
        "populate[category]": "*",
        "populate[reviews]": "*",
        "populate[discount]": "*",
        "populate[localizations]": "*",
        "populate[product_inventory]": "*",
        "populate[sizes]": "*",
        "populate[colors]": "*",
        // locale: locale,
        //  sort: sortingType,
      };

      // Add filters first
      if (category) {
        queryParams["filters[category][name][$eq]"] = category.replaceAll(
          "%20",
          " "
        );
      }

      if (colorName.length > 0) {
        queryParams["filters[colors][name][$eq]"] = colorName;
      }

      if (minPrice.length > 0) {
        queryParams["filters[price][$gt]"] = minPrice;
      }

      if (maxPrice.length > 0) {
        queryParams["filters[price][$lt]"] = maxPrice;
      }

      if (isSalesOnly) {
        queryParams["filters[type][$eq]"] = "sale";
      }

      if (searchQuery) {
        queryParams["filters[$or][0][title][$contains]"] = searchQuery;
        queryParams["filters[$or][1][description][$contains]"] = searchQuery;
        queryParams["filters[$or][2][category][name][$contains]"] = searchQuery;
        queryParams["filters[$or][3][colors][name][$contains]"] = searchQuery;
      }

      // Add pagination last
      queryParams["pagination[page]"] = this.pagination.page;
      queryParams["pagination[pageSize]"] = this.pagination.pageSize;

      // Separate populate and other params
      const populateParams = [
        "populate[images]=*",
        "populate[thumbnail]=*",
        "populate[category]=*",
        "populate[reviews]=*",
        "populate[discount]=*",
        "populate[localizations]=*",
        "populate[product_inventory]=*",
        "populate[sizes]=*",
        "populate[colors]=*"
      ].join("&");

      const otherParams = Object.entries(queryParams)
        .filter(([key, value]) => !key.startsWith("populate[") && value !== undefined && value !== "")
        .map(([key, value]) => {
          // Don't encode filter keys to avoid %5B and %5D
          if (key.startsWith('filters[')) {
            return `${key}=${encodeURIComponent(value!)}`;
          }
          return `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`;
        });

      // Join populate with first filter without &, then add other params with &
      const queryString = otherParams.length > 0
        ? populateParams + otherParams[0] + (otherParams.length > 1 ? "&" + otherParams.slice(1).join("&") : "")
        : populateParams;

      const url = `${endpoint}?${queryString}`;

      await fetch(url, this.getMethodOptions)
        .then((res) => res.json())
        .then((data) => {
          // console.log(
          //   "this is the data of the promise we get from deal products : ",
          //   data
          // );

          let beforeSortingProducts: strapiProductType[] = [];

          beforeSortingProducts = data.data;

          let productsWithIds: { id: number; averageRating: number }[] = [];

          beforeSortingProducts.forEach((p) => {
            const newProduct: { id: number; averageRating: number } = {
              id: p.id,
              averageRating: this.getAverageRatings(p.attributes.reviews.data),
            };

            productsWithIds.push(newProduct);
          });

          let sortedProductsIds = productsWithIds.sort((a, b) => {
            return b.averageRating - a.averageRating;
          });

          let finalSortedProducts: strapiProductType[] = [];

          sortedProductsIds.forEach((sP) => {
            let findedProduct: strapiProductType | undefined =
              beforeSortingProducts.find((bP) => {
                return sP.id === bP.id;
              });
            finalSortedProducts.push(
              findedProduct ?? ({} as strapiProductType)
            );
          });

          // after finsih sorting

          runInAction(() => {
            this.products = finalSortedProducts;
            this.pagination = data.meta?.pagination || this.pagination;
            this.productsLoading = false;
          });
        })
        .catch((err) => console.log(err));
    }
  };

  getProductFromSearchingBar = async (searchQuery: string) => {
    runInAction(() => {
      this.productsLoading = true;
    });

    interface QueryParams {
      "populate[images]"?: string;
      "populate[thumbnail]"?: string;
      "populate[category]"?: string;
      "populate[reviews]"?: string;
      "populate[discount]"?: string;
      "populate[localizations]"?: string;
      "populate[product_inventory]"?: string;
      "populate[sizes]"?: string;
      "populate[colors]"?: string;
      "pagination[page]"?: number;
      "pagination[pageSize]"?: number;
      [key: string]: string | number | undefined;
    }

    const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/products/`;

    const queryParams: QueryParams = {
      "populate[images]": "*",
      "populate[thumbnail]": "*",
      "populate[category]": "*",
      "populate[reviews]": "*",
      "populate[discount]": "*",
      "populate[localizations]": "*",
      "populate[product_inventory]": "*",
      "populate[sizes]": "*",
      "populate[colors]": "*",
      // Add filters first
      "filters[$or][0][title][$contains]": searchQuery,
      "filters[$or][1][description][$contains]": searchQuery,
      "filters[$or][2][category][name][$contains]": searchQuery,
      "filters[$or][3][colors][name][$contains]": searchQuery,
    };

    // Add pagination last
    queryParams["pagination[page]"] = this.pagination.page;
    queryParams["pagination[pageSize]"] = this.pagination.pageSize;

    // Separate populate and other params
    const populateParams = [
      "populate[images]=*",
      "populate[thumbnail]=*",
      "populate[category]=*",
      "populate[reviews]=*",
      "populate[discount]=*",
      "populate[localizations]=*",
      "populate[product_inventory]=*",
      "populate[sizes]=*",
      "populate[colors]=*"
    ].join("&");

    const otherParams = Object.entries(queryParams)
      .filter(([key, value]) => !key.startsWith("populate[") && value !== undefined && value !== "")
      .map(([key, value]) => {
        // Don't encode filter keys to avoid %5B and %5D
        if (key.startsWith('filters[')) {
          return `${key}=${encodeURIComponent(value!)}`;
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`;
      });

    // Join populate with first filter without &, then add other params with &
    const queryString = otherParams.length > 0
      ? populateParams + otherParams[0] + (otherParams.length > 1 ? "&" + otherParams.slice(1).join("&") : "")
      : populateParams;

    const url = `${endpoint}?${queryString}`;

    await fetch(url, this.getMethodOptions)
      .then((res) => res.json())
      .then((data) => {
        // console.log(
        //   "this is the data of the promise we get from deal products : ",
        //   data
        // );
        runInAction(() => {
          this.products = data.data || [];
          this.pagination = data.meta?.pagination || this.pagination;
          this.productsLoading = false;
        });
      })
      .catch((err) => console.log(err));
  };

  // methods to handle another things far away from api endpoints

  getAverageRatings(ratings: Datum[]) {
    let sum = 0;
    let avg = 0;
    let allowedRatingsLength = 0;

    if (ratings?.length > 0) {
      ratings.map((p) => {
        if (p.attributes.allowed) {
          sum = sum + p.attributes.rating;
          allowedRatingsLength = allowedRatingsLength + 1;
        }
      });

      avg = sum / allowedRatingsLength;

      return avg;
    } else {
      return 0;
    }
  }

  getPriceAfterDiscount(discountData: Data | null | undefined, currentPrice: number) {
    if (discountData) {
      let discountValue =
        (discountData.attributes.discount_percent * currentPrice) / 100;
      return Number((currentPrice - discountValue).toFixed(2));
    } else {
      return undefined;
    }
  }

  setPaginationPage(val: number, pageSize: number) {
    this.pagination = {
      ...this.pagination,
      page: val,
      pageSize: pageSize,
    };
  }
}
