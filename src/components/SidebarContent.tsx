"use client";
import React, { useContext, useEffect, useState } from "react";
import { LiaNewspaper } from "react-icons/lia";
import { FaRegEye } from "react-icons/fa";
import { Divider } from "@nextui-org/react";
import { StoreContext } from "@/contexts/StoreContext";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { IoMdClose } from "react-icons/io";
import UserSidebarMenu from "./UserSidebarMenu";
import { isUserLoggedIn } from "@/functions/credentials";

const SidebarContent = () => {
  const { sidebar, categories } = useContext(StoreContext);

  const urlParams: Params = useParams();

  const [editedParams, setEditedParam] = useState<string>("");

  useEffect(() => {
    categories.getAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (urlParams.name) {
      setEditedParam(urlParams.name.replaceAll("%20", " "));
    }
  }, [urlParams]);

  return (
    <div className="relative hidden md:flex flex-col ">
      <div className="sticky top-0 flex  flex-col bg-mainWhite">
        <div className=" flex justify-between items-center px-5 py-3">
          <h1 className="text-3xl text-mainPink uppercase font-bold">logo</h1>
          <div
            className="flex items-start justify-center text-3xl"
            onClick={sidebar.hideWholeSidebar}
          >
            <IoMdClose className=" cursor-pointer" />
          </div>
        </div>
        <Divider />
      </div>

      <div className="py-5 flex flex-col gap-3 capitalize px-5">
        {categories.categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.attributes.name}`}
            className={`side-link ${
              editedParams === cat.attributes.name && `text-mainPink`
            }`}
            onClick={sidebar.hideWholeSidebar}
          >
            {cat.attributes.name}
          </Link>
        ))}
      </div>
      <div className="flex flex-col ">
        <Divider />
        <div className="flex py-3 flex-col px-5 gap-2 capitalize">
          <div className="flex items-center text-lg gap-2 text-mainBlack/50">
            <LiaNewspaper />
            <Link href={"/order"}>track your order</Link>
          </div>
          <div className="flex items-center text-lg gap-2 text-mainBlack/50">
            <FaRegEye />
            <Link href={"#"}>products recently seen</Link>
          </div>
        </div>
        {isUserLoggedIn() && (
          <>
            <Divider />
            <UserSidebarMenu />
          </>
        )}
      </div>
    </div>
  );
};

export default observer(SidebarContent);
