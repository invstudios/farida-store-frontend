"use client";

import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/contexts/StoreContext";
import UserLoggedInUi from "./UserLoggedInUi";

import { Button } from "@nextui-org/react";
import { useRouter } from "@/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLocale, useTranslations } from "next-intl";
import GoogleProvider from "@/app/[locale]/(auth)/GoogleProvider";

const UserDrop = () => {
  const { userDrop, user, loginForm, registerForm } = useContext(StoreContext);
  const { isLoggedIn, isLoading } = useAuth();
  const [uiCondition, setUiCondition] = useState(true); // Default to show login form

  const locale = useLocale();
  const t = useTranslations("loginForm");

  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      setUiCondition(!isLoggedIn);
    }
  }, [isLoggedIn, isLoading, user.isLoading, loginForm.isLoading, registerForm.isLoading]);

  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{
        scaleY: userDrop.isUserMenuDisplayed ? 1 : 0,
        opacity: userDrop.isUserMenuDisplayed ? 1 : 0,
      }}
      className={`origin-top flex flex-col gap-5 bg-mainWhite min-w-[20rem] capitalize w-auto h-auto ${
        uiCondition ? "p-3 px-5" : ""
      } text-mainBlack absolute top-20 ${
        locale === "en" ? "right-36" : "left-36"
      } z-10 border-1 border-solid border-mainBlack border-t-0`}
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      {uiCondition ? (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{t("login")}</h1>
            <div className="flex items-center">
              <GoogleProvider format="small" />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginForm.strapiLogin();
              if (isLoggedIn) {
                router.refresh();
              }
            }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label className="input-label">{t("labels.email")}</label>
              <input
                type="email"
                className="nav-input"
                value={loginForm.email}
                onChange={(e) => {
                  // userDrop.setEmailValue(e.target.value)
                  loginForm.setEmail(e.target.value);
                }}
                onFocus={() => {
                  userDrop.setEmailFocus(true);
                }}
                onBlur={() => {
                  userDrop.setEmailFocus(false);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="input-label">{t("labels.password")}</label>
              <input
                type="password"
                className="nav-input"
                value={loginForm.password}
                onChange={(e) => {
                  // userDrop.setPasswordValue(e.target.value)
                  loginForm.setPassword(e.target.value);
                }}
                onFocus={() => {
                  userDrop.setPasswordFocus(true);
                }}
                onBlur={() => {
                  userDrop.setPasswordFocus(false);
                }}
              />
            </div>
            <div className="flex gap-5 items-center">
              <Button
                isLoading={loginForm.isLoading}
                className="bg-mainBlack text-mainWhite p-3 px-10 rounded-lg capitalize"
                type="submit"
              >
                {t("submit")}
              </Button>
              {/* <div className='text-sm flex items-center gap-1 '>
                      <input id='remeber' type='checkbox' className='cursor-pointer'/>
                      <label htmlFor='remeber' className='cursor-pointer'>remeber me</label>
                  </div> */}
              {/* <h1 className='text-sm text-red-500'>{ userDrop.errorMessage.slice(22,userDrop.errorMessage.length-2)}</h1> */}
              <h1 className="text-sm text-red-500">{loginForm.errorMessage}</h1>
            </div>
          </form>
        </div>
      ) : (
        <UserLoggedInUi />
      )}
    </motion.div>
  );
};

export default observer(UserDrop);
