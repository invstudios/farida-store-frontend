"use client";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { useScreenSize } from "react-screen-size-helper";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
const ComplaintForm = () => {
  const { currentWidth } = useScreenSize({});
  const { register, handleSubmit } = useForm();

  const t = useTranslations("contactPage");

  const submitcomplaint = () => {
    toast(t("form.sended"));
  };

  return (
    <div className="w-full px-5 medmob:px-10 lmob:px-20  md:px-28 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-4xl font-bold capitalize">
          {t("form.title")}
        </h1>
        <h1 className="text-sm md:text-xl text-mainBlack/50 capitalize">
          {t("form.subTitle")}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit((data) => {
          submitcomplaint();
        })}
        className="w-full flex flex-col gap-5"
      >
        <Input
          {...register("name")}
          isRequired
          label={t("form.labels.name")}
          placeholder={t("form.placeholders.name")}
          labelPlacement="outside"
          variant="bordered"
          radius="none"
          type="text"
          inputMode="text"
          size={currentWidth > 768 ? "lg" : "md"}
          className="w-full "
          classNames={{
            label: "rtl:right-0",
          }}
        />
        <Input
          {...register("email")}
          isRequired
          label={t("form.labels.email")}
          placeholder={t("form.placeholders.email")}
          labelPlacement="outside"
          variant="bordered"
          radius="none"
          type="email"
          inputMode="email"
          size={currentWidth > 768 ? "lg" : "md"}
          className="w-full "
          classNames={{
            label: "rtl:right-0",
          }}
        />
        <Textarea
          {...register("message")}
          isRequired
          minRows={20}
          label={t("form.labels.message")}
          placeholder={t("form.placeholders.message")}
          labelPlacement="outside"
          variant="bordered"
          radius="none"
          type="text"
          inputMode="text"
          size={currentWidth > 768 ? "lg" : "md"}
          className="w-full "
        />
        <Button
          radius="none"
          type="submit"
          size={currentWidth > 768 ? "lg" : "md"}
          className="bg-mainBlack text-mainWhite text-sm md:text-xl"
        >
          {t("form.action")}
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ComplaintForm;
