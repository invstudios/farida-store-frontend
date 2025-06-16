"use client";
import React, { useContext, useEffect, useState } from "react";
import { LiaNewspaper } from "react-icons/lia";
import { FaRegEye } from "react-icons/fa";
import SafeDivider from "./SafeDivider";
import { StoreContext } from "@/contexts/StoreContext";
import { Link } from "@/navigation";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { IoMdClose } from "react-icons/io";
import UserSidebarMenu from "./UserSidebarMenu";
import { useAuth } from "@/hooks/useAuth";
import { useLocale, useTranslations } from "next-intl";

const SidebarContent = () => {
  const { sidebar, categories } = useContext(StoreContext);
  const { isLoggedIn } = useAuth();

  const urlParams: Params = useParams();

  const [editedParams, setEditedParam] = useState<string>("");

  const t = useTranslations("sidebar");
  const locale = useLocale();

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
    <div className="relative hidden md:flex flex-col " suppressHydrationWarning={true}>
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
        <SafeDivider />
      </div>

      <div className="py-5 flex flex-col gap-3 capitalize px-5">
        {locale === "en"
          ? categories.categories?.map((cat) => (
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
            ))
          : categories.categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.attributes.name}`}
                className={`side-link ${
                  editedParams === cat.attributes.name && `text-mainPink`
                }`}
                onClick={sidebar.hideWholeSidebar}
              >
                {cat.attributes?.localizations?.data[0].attributes.name}
              </Link>
            ))}
      </div>
      <div className="flex flex-col " suppressHydrationWarning={true}>
        <SafeDivider />
        <div className="flex py-3 flex-col px-5 gap-2 capitalize">
          <div className="flex items-center text-lg gap-2 text-mainBlack/50">
            <LiaNewspaper />
            <Link href={"/order"}>{t("order")}</Link>
          </div>
          <div className="flex items-center text-lg gap-2 text-mainBlack/50">
            <FaRegEye />
            <Link href={"#"}>{t("seen")}</Link>
          </div>
        </div>
        {isLoggedIn && (
          <>
            <SafeDivider />
            <UserSidebarMenu />
          </>
        )}
      </div>
    </div>
  );
};

export default observer(SidebarContent);
