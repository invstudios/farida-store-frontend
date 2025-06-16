"use client";
import { useAuth } from "@/hooks/useAuth";
import { Button, Chip, User } from "@nextui-org/react";
import SafeDivider from "./SafeDivider";
import React, { useContext } from "react";
import { FaArrowRight, FaRegUserCircle } from "react-icons/fa";
import UserLoggedInUi from "./UserLoggedInUi";
import { IoBagOutline } from "react-icons/io5";
import { Link } from "@/navigation";
import { RiUserSettingsLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from "@/navigation";

import { observer } from "mobx-react-lite";
import { StoreContext } from "@/contexts/StoreContext";
import { useTranslations } from "next-intl";

const UserSidebarMenu = () => {
  const { user, sidebar } = useContext(StoreContext);

  const router = useRouter();
  const t = useTranslations("userLoggedIn");

  const logout = () => {
    user.isLoading = true;
    user.userLogout().then(() => {
      user.isLoading = false;
    });
    sidebar.hideWholeSidebar();
    router.refresh();
    // router.push("/");
  };

  return (
    <div className="md:text-mainBlack/50">
      <SafeDivider />

      <div className="py-5 px-5 flex flex-col gap-3 text-lg">
        <Link href={"/user"} className="md:hidden">
          <User
            name={user.strapiUserdata?.username}
            description={user.strapiUserdata?.email}
            // avatarProps={{
            //   src: `${process.env.NEXT_PUBLIC_HOST}${user.strapiUserdata.avatar?.url}`,
            // }}
            className=" lowercase"
          />
        </Link>

        <Link
          href={"/userorders"}
          className="flex items-center justify-between gap-2 "
          onClick={sidebar.hideWholeSidebar}
        >
          <div className="flex gap-2 items-center ">
            <IoBagOutline />
            <h1>{t("orders")}</h1>
          </div>
          <div className="flex items-center gap-5">
            <Chip
              classNames={{
                base: "bg-mainBlack md:bg-mainBlack/50 text-mainWhite",
              }}
            >
              {user.strapiUserdata.order_details?.length}
            </Chip>
            {/* <FaArrowRight className="text-sm" /> */}
          </div>
        </Link>
        <Link
          href={"/userprofile"}
          className="flex items-center justify-between gap-2 "
          onClick={sidebar.hideWholeSidebar}
        >
          <div className="flex gap-2 items-center">
            <RiUserSettingsLine />
            <h1> {t("profile")}</h1>
          </div>
          <div className="flex items-center gap-5">
            {/* <FaArrowRight className="text-sm" /> */}
          </div>
        </Link>
        <div
          className="flex flex-col  gap-2  cursor-pointer select-none"
          onClick={logout}
        >
          <SafeDivider />
          <div className="flex gap-2 items-center text-red-500">
            <IoIosLogOut />
            <h1> {t("logout")}</h1>
          </div>
        </div>
        {/* {isUserLoggedIn() && (
          <Button className="text-mainWhite bg-red-500 capitalize">
            logout
          </Button>
        )} */}
      </div>
    </div>
  );
};

export default observer(UserSidebarMenu);
