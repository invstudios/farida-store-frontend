"use client";
import { StoreContext } from "@/contexts/StoreContext";
import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Chip, Divider, User } from "@nextui-org/react";
import { IoMdLogOut } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "@/navigation";
import { RiUserSettingsLine } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

const UserLoggedInUi = () => {
  const { user } = useContext(StoreContext);

  const router = useRouter();
  const t = useTranslations("userLoggedIn");

  // const logout = () => {
  //     setIsLoading(true)
  //     signOut(auth).then(() => {
  //         setIsLoading(false)
  //     router.push("/login")
  //     }).catch((err) => {
  //         setIsLoading(false)
  //     })
  // }

  const logout = () => {
    user.isLoading = true;
    user.userLogout().then(() => {
      user.isLoading = false;
    });
    router.refresh();
    // router.push("/");
  };

  useEffect(() => {
    user.getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-w-[20rem] w-auto h-auto flex flex-col justify-start items-center py-5 ">
      <div className="flex flex-col gap-5 w-full h-full ">
        <Link href={"/user"} className="flex justify-center items-center">
          <User
            name={user.strapiUserdata?.username}
            description={user.strapiUserdata?.email}
            // avatarProps={{
            //   src: `${process.env.NEXT_PUBLIC_HOST}${user.strapiUserdata.avatar?.url}`,
            // }}
            className="px-3 lowercase"
          />
        </Link>
        <Divider />
        <Link
          href={"/userorders"}
          className="flex items-center justify-between gap-2 px-3"
        >
          <div className="flex gap-2 items-center ">
            <IoBagOutline />
            <h1>{t("orders")}</h1>
          </div>
          <div className="flex items-center gap-5">
            <Chip
              classNames={{
                base: "bg-mainBlack text-mainWhite",
              }}
            >
              {/* {user.strapiUserdata.reviews.length} */}
              {user.strapiUserdata.order_details?.length}
            </Chip>
            <FaArrowRight className="text-sm" />
          </div>
        </Link>
        <Link
          href={"/userprofile"}
          className="flex items-center justify-between gap-2 px-3"
        >
          <div className="flex gap-2 items-center">
            <RiUserSettingsLine />
            <h1>{t("profile")}</h1>
          </div>
          <div className="flex items-center gap-5">
            <FaArrowRight className="text-sm" />
          </div>
        </Link>

        <div>
          <Divider />
          <div className="flex pt-2 px-5 justify-center items-center text-lg bg-transparent ">
            <Button
              //   endContent={

              //       <IoMdLogOut className='text-red-600'/>

              //     }
              radius="sm"
              isLoading={user.isLoading}
              className="text-lg bg-red-600 text-mainWhite w-full"
              onClick={logout}
            >
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(UserLoggedInUi);
