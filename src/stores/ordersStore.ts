import { isUserLoggedIn } from "@/functions/credentials";
import { makeAutoObservable, runInAction } from "mobx";
import { userCartProductType } from "./specificTypes/userCartProductType";
import { OrderDetail } from "./specificTypes/orderAddressType";
import { OrderDetails, OrderItems } from "./specificTypes/orderItemsType";
import { UserOrderDetails } from "./specificTypes/userOrderDetailsType";

export class OrdersStore {
  isCreatingOrderLoading: boolean = false;

  orderDetails: OrderDetail = {} as OrderDetail;
  orderItems: OrderItems = {} as OrderItems;
  userOrders: UserOrderDetails[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addNewUserAddress = async (userAddressData: {
    street: string;
    state: string;
    city: string;
    country: string;
    postalcode: string;
    phone: string;
    userId: string;
    second_phone: string;
    fullname: string;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/user-addresses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
        body: JSON.stringify({
          data: {
            street: userAddressData.street,
            state: userAddressData.state,
            city: userAddressData.city,
            country: userAddressData.country,
            postalcode: userAddressData.postalcode,
            phone: userAddressData.phone,
            user: userAddressData.userId,
            second_phone: userAddressData.second_phone,
            fullname: userAddressData.fullname,
          },
        }),
      }
    );

    if (response.ok) {
      let data = await response.json();

      return data;
    } else {
      return null;
    }
  };

  addNewUserPaymentMethod = async () => {};

  createNewOrderItem = async (
    productId: string | number,
    quantity: number,
    orderDetailId: string | number
  ) => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/order-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
        body: JSON.stringify({
          data: {
            order_detail: orderDetailId,
            product: productId,
            quantity: quantity,
          },
        }),
      }
    );

    if (response.ok) {
      let data = await response.json();

      return data;
    } else {
      return null;
    }
  };

  createNewOrder = async (newOrderData: {
    totalPrice: number;
    userPaymentId: string | null;
    userId: string | null;
    orderAddressId: string | null;
    orderNotes: string | null;
    // orderItemsIds: string[];
  }) => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/order-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
        body: JSON.stringify({
          data: {
            total: newOrderData.totalPrice,
            user_payment: newOrderData.userPaymentId,
            user: newOrderData.userId,
            user_order_address: newOrderData.orderAddressId,
            order_notes: newOrderData.orderNotes,
            //   order_items: newOrderData.orderItemsIds,
          },
        }),
      }
    );

    if (response.ok) {
      let data = await response.json();

      return data;
    } else {
      return null;
    }
  };

  createOrderItemsFromCart = async (
    cartItems: userCartProductType[],
    orderDetailId: number | string
  ) => {
    cartItems.forEach((item) => {
      this.createNewOrderItem(item.id, item.quantity, orderDetailId).then();
    });
  };

  getOrderDetails = async (orderId: number | string) => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/order-details/${orderId}?populate=user_order_address`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
      }
    );

    if (response.ok) {
      let data: OrderDetail = await response.json();

      runInAction(() => {
        this.orderDetails = data;
      });

      return data;
    } else {
      return null;
    }
  };

  getOrderDetailsAddress = async (orderId: number | string) => {
    let data = await this.getOrderDetails(orderId);

    return data?.data.attributes.user_order_address;
  };

  getAllOrderItems = async (orderId: number | string) => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/order-details/${orderId}?[populate][order_items][populate][product][populate]=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
      }
    );

    if (response.ok) {
      let data: OrderDetails = await response.json();

      runInAction(() => {
        if (data.data.attributes.order_items) {
          this.orderItems = data.data.attributes.order_items;
        }
      });

      return response.ok;
    } else {
      return null;
    }
  };

  isOrderInUserOrdersList = async (
    orderId: string | number,
    userId: string | number
  ) => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/order-details/${orderId}?populate=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
      }
    );

    if (response.ok) {
      let data = await response.json();

      if (data) {
        if (data?.data?.attributes?.user?.data?.id === userId) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  getUserOrders = async () => {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT}/users/me?[populate][order_details][populate]=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn()}`,
        },
      }
    );

    if (response.ok) {
      let data = await response.json();

      // console.log(
      //   "this is the data from get user orders functiion :- ",
      //   data.order_details
      // );

      if (data) {
        runInAction(() => {
          this.userOrders = data.order_details;
        });

        return response.ok;
      } else {
        return false;
      }

      // if (data) {
      //   if (data?.data?.attributes?.user?.data?.id === userId) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // } else {
      //   return false;
      // }
    }
  };

  set setIsCreatingOrderLoading(val: boolean) {
    this.isCreatingOrderLoading = val;
  }
}