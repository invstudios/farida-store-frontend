"use client";

import React, { useContext } from "react";
import { FaGoogle } from "react-icons/fa";

import { useRouter } from "@/navigation";

import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

interface providerProps {
  format?: "small" | "large";
}

const GoogleProvider = ({ format = "large" }: providerProps) => {
  const router = useRouter();
  const { user } = useContext(StoreContext);
  const t = useTranslations("google");

  const googleSign = () => {
    // const provider = new GoogleAuthProvider()
    // signInWithPopup(auth, provider).then((result) => {
    //  user.addUserToUsersCollection(result.user.uid, {
    //     firstName: result.user.displayName ,
    //    lastName: result.user.displayName,
    //    cart: {
    //      items: [],
    //      discount: "",
    //      shipping: 0,
    //      subTotal: 0,
    //      tax: 0,
    //      total: 0,
    //      totalItems:0
    //    }
    //    ,
    //    address: {
    //      city: "",
    //      country: "",
    //      postalCode: ""
    //      , state: "",
    //    street:""
    //    },
    //    orders: [
    //    ]
    //    ,
    //    paymentMethods: [],
    //    wishList:[]
    //  }).then(() => {
    //    router.push("/")
    //   })
    // }).catch((err) => {})
  };

  return (
    <>
      {format === "large" ? (
        <div className="w-full md:w-2/3 lg:w-1/3">
          <div
            className="cursor-pointer h-auto w-full text-sm md:text-lg transition-all border-mainBlack hover:border-mainBlack/50 border-2 border-solid flex items-center justify-center flex-wrap gap-5 p-2 md:p-4"
            onClick={googleSign}
          >
            <h1 className="capitalize text-center ">{t("continue")}</h1>
            <FaGoogle className="text-xl md:text-3xl " />
          </div>
        </div>
      ) : (
        <div
          className="cursor-pointer h-auto w-max text-lg transition-all border-mainBlack hover:border-mainBlack/50 border-2 border-solid flex items-center justify-center p-2 rounded-full"
          onClick={googleSign}
        >
          <FaGoogle className="text-3xl " />
        </div>
      )}
    </>
  );
};

export default observer(GoogleProvider);
