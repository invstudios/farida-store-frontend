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
import { isUserLoggedIn } from "@/functions/credentials";

const RegisterForm = () => {
  const { registerForm } = useContext(StoreContext);
  const { isMobile } = useScreenSize({});
  const t = useTranslations("registerForm");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    registerForm.setDisabledCondition(
      registerForm.isValidEmail &&
        registerForm.isValidPassword &&
        registerForm.email.length > 0 &&
        registerForm.password.length > 0 &&
        registerForm.confirmedPassword.length > 0 &&
        registerForm.firstName.length > 0 &&
        registerForm.lastName.length > 0 &&
        registerForm.username.length > 0 &&
        registerForm.password === registerForm.confirmedPassword
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    registerForm.isValidEmail,
    registerForm.isValidPassword,
    registerForm.email,
    registerForm.password,
    registerForm.confirmedPassword,
    registerForm.firstName,
    registerForm.lastName,
    registerForm.username,
  ]);

  useEffect(() => {
    if (isUserLoggedIn()) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerForm.isLoading]);

  return (
    <div
      className="w-full flex flex-col p-5 px-7 lmob:px-20 items-center lg:items-start gap-10"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <h1 className="text-3xl font-bold capitalize hidden lg:block">
        {t("register")}
      </h1>
      <form className="w-full md:w-2/3 lg:w-1/3 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-2">
          <Input
            value={registerForm.firstName}
            variant="bordered"
            isRequired
            type="text"
            label={t("labels.first")}
            labelPlacement="outside"
            placeholder={t("placeholders.first")}
            radius="none"
            size={isMobile ? "md" : "lg"}
            onChange={(e) => {
              registerForm.setFirstName(e.target.value);
            }}
            classNames={{
              label: locale === "ar" && "right-3",
            }}
          />

          <Input
            value={registerForm.lastName}
            variant="bordered"
            type="text"
            label={t("labels.last")}
            labelPlacement="outside"
            placeholder={t("placeholders.last")}
            radius="none"
            size={isMobile ? "md" : "lg"}
            isRequired
            onChange={(e) => {
              registerForm.setlastName(e.target.value);
            }}
            classNames={{
              label: locale === "ar" && "right-3",
            }}
          />
        </div>

        <Input
          value={registerForm.username}
          variant="bordered"
          isRequired
          type="text"
          label={t("labels.username")}
          labelPlacement="outside"
          placeholder={t("placeholders.username")}
          radius="none"
          size={isMobile ? "md" : "lg"}
          onChange={(e) => {
            registerForm.setUsername(e.target.value);
          }}
          classNames={{
            label: locale === "ar" && "right-3",
          }}
        />

        <Input
          value={registerForm.email}
          variant="bordered"
          isInvalid={!registerForm.isValidEmail}
          color={!registerForm.isValidEmail ? "danger" : "success"}
          isRequired
          type="email"
          label={t("labels.email")}
          labelPlacement="outside"
          placeholder={t("placeholders.email")}
          errorMessage={!registerForm.isValidEmail && t("errors.email")}
          radius="none"
          size={isMobile ? "md" : "lg"}
          onChange={(e) => {
            registerForm.setEmail(e.target.value);
            registerForm.validateEmail();
          }}
          classNames={{
            label: locale === "ar" && "right-3",
          }}
        />
        <Input
          value={registerForm.password}
          variant="bordered"
          isRequired
          type={!registerForm.isPasswordVisible ? "password" : "text"}
          label={t("labels.password")}
          labelPlacement="outside"
          placeholder={t("placeholders.password")}
          radius="none"
          size={isMobile ? "md" : "lg"}
          description={
            !registerForm.isValidPassword ? t("errors.password") : ""
          }
          onChange={(e) => {
            registerForm.setPassword(e.target.value);
            registerForm.validatePassword();
          }}
          endContent={
            <div
              className="cursor-pointer"
              onMouseDown={() => {
                registerForm.setIsPasswordVisible(true);
              }}
              onMouseUp={() => {
                registerForm.setIsPasswordVisible(false);
              }}
            >
              {!registerForm.isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </div>
          }
          classNames={{
            label: locale === "ar" && "right-3",
          }}
        />

        <Input
          value={registerForm.confirmedPassword}
          variant="bordered"
          isRequired
          type={!registerForm.isConfirmedPasswordVisible ? "password" : "text"}
          label={t("labels.confirm")}
          labelPlacement="outside"
          placeholder={t("placeholders.confirm")}
          radius="none"
          size={isMobile ? "md" : "lg"}
          color={
            registerForm.confirmedPassword !== registerForm.password
              ? "danger"
              : "success"
          }
          errorMessage={
            registerForm.confirmedPassword !== registerForm.password
              ? t("errors.confirm")
              : ""
          }
          onChange={(e) => {
            registerForm.setConfirmedPassword(e.target.value);
          }}
          endContent={
            <div
              className="cursor-pointer"
              onMouseDown={() => {
                registerForm.setIsConfirmedPasswordVisible(true);
              }}
              onMouseUp={() => {
                registerForm.setIsConfirmedPasswordVisible(true);
              }}
            >
              {!registerForm.isConfirmedPasswordVisible ? (
                <FaEye />
              ) : (
                <FaEyeSlash />
              )}
            </div>
          }
          classNames={{
            label: locale === "ar" && "right-3",
          }}
        />

        <div className="grid grid-rows-2 grid-cols-1 lmob:grid-rows-1 lmob:grid-cols-2 items-center gap-2">
          <Button
            isLoading={registerForm.isLoading}
            isDisabled={!registerForm.disabledCondition}
            type="submit"
            radius="none"
            size={isMobile ? "md" : "lg"}
            className={`${
              !registerForm.disabledCondition ? "bg-stone-400" : "bg-mainBlack"
            } text-mainWhite `}
            onClick={(e) => {
              // registerWithEmailAndPass(e)

              registerForm.strapiRegister();
            }}
          >
            {t("submit")}
          </Button>
          {/* <h1 className='text-red-400'>{errorMessage.slice(22,errorMessage.length-2) }</h1> */}
          <h1 className="text-red-400 text-sm md:text-lg">
            {registerForm.errorMessage}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm md:text-lg">
          <h1 className="text-mainBlack/50 underline">{t("haveAccount")}</h1>
          <Link href={`/login`} className="text-blue-500">
            {t("login")}
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

export default observer(RegisterForm);
