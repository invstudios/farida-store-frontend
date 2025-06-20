"use client";
import { Button, Divider, Input } from "@nextui-org/react";
import { Link, useRouter } from "@/navigation";
import React, { useContext, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import GoogleProvider from "../../GoogleProvider";

import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import Cookies from "js-cookie";
import { useScreenSize } from "react-screen-size-helper";
import { useLocale, useTranslations } from "next-intl";

const LoginForm = () => {
  const router = useRouter();
  const { isMobile } = useScreenSize({});

  const { loginForm } = useContext(StoreContext);
  const t = useTranslations("loginForm");
  const locale = useLocale();

  const loginWithEmailAndPass = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    // loginForm.firebaseLoginWithEmailAndPass()?.then(() => {
    //     loginForm.setIsloading(false)
    //     router.push("/")
    // }).catch((err) => {
    //     loginForm.setIsloading(false)
    //     loginForm.setErrMessage(err.message)
    // })

    loginForm.strapiLogin();
  };

  useEffect(() => {
    if (Cookies.get("credentials")) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginForm.isLoading]);

  return (
    <div
      className="w-full flex flex-col p-5 px-7 lmob:px-20 items-center lg:items-start gap-10"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <h1 className="text-3xl font-bold capitalize hidden lg:block">
        {t("login")}
      </h1>
      <form className="w-full md:w-2/3 lg:w-1/3 flex flex-col gap-5">
        <Input
          value={loginForm.email}
          variant="bordered"
          isInvalid={!loginForm.isValidEmail}
          color={!loginForm.isValidEmail ? "danger" : "success"}
          isRequired
          type="email"
          label={t("labels.email")}
          labelPlacement="outside"
          placeholder={t("placeholders.email")}
          errorMessage={!loginForm.isValidEmail && t("errors.email")}
          radius="none"
          size={isMobile ? "md" : "lg"}
          onChange={(e) => {
            loginForm.setEmail(e.target.value);
            loginForm.validateEmail();
          }}
          classNames={{
            label: locale === "ar" && "right-3",
          }}
        />
        <Input
          value={loginForm.password}
          variant="bordered"
          isRequired
          type={!loginForm.isPasswordVisible ? "password" : "text"}
          label={t("labels.password")}
          labelPlacement="outside"
          placeholder={t("placeholders.password")}
          radius="none"
          size={isMobile ? "md" : "lg"}
          //   description="write valid email"

          onChange={(e) => {
            loginForm.setPassword(e.target.value);
          }}
          endContent={
            <div
              className="cursor-pointer"
              onMouseDown={() => {
                loginForm.setIsPasswordVisible(true);
              }}
              onMouseUp={() => {
                loginForm.setIsPasswordVisible(false);
              }}
            >
              {!loginForm.isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </div>
          }
          classNames={{
            label: locale === "ar" && "right-3",
          }}
        />

        <div className="grid grid-rows-2 grid-cols-1 lmob:grid-rows-1 lmob:grid-cols-2 items-center gap-2">
          <Button
            isLoading={loginForm.isLoading}
            isDisabled={
              !(
                loginForm.email.length > 0 &&
                loginForm.password.length > 5 &&
                loginForm.isValidEmail
              )
            }
            type="submit"
            size={isMobile ? "md" : "lg"}
            radius="none"
            className="bg-mainBlack text-mainWhite capitalize "
            onClick={(e) => {
              loginWithEmailAndPass(e);
            }}
          >
            {t("submit")}
          </Button>
          {/* <h1 className='text-red-400'>{loginForm.errorMessage.slice(22,loginForm.errorMessage.length-2) }</h1> */}
          <h1 className="text-red-400 text-sm md:text-lg">
            {loginForm.errorMessage}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm md:text-lg">
          <h1 className="text-mainBlack/50 underline">{t("noAccount")}</h1>
          <Link href={`/register`} className="text-blue-500">
            {t("register")}
          </Link>
        </div>
      </form>
      <div className="w-full md:w-2/3 lg:w-1/3 grid grid-cols-[1fr_auto_1fr] justify-between items-center">
        <Divider />
        <h1 className="text-sm md:text-lg capitalize px-5">{t("or")}</h1>
        <Divider />
      </div>
      <GoogleProvider />
    </div>
  );
};

export default observer(LoginForm);
