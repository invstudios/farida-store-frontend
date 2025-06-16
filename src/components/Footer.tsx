"use client";
import { Image } from "@nextui-org/react";
import SafeDivider from "./SafeDivider";
import React from "react";

import { TfiEmail } from "react-icons/tfi";
import { TfiHeadphone } from "react-icons/tfi";
import IconCard from "./IconCard";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import Icon from "./Icon";
import { useLocale, useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <div className=" pt-20 pb-16" dir={locale === "en" ? "ltr" : "rtl"}>
      <SafeDivider />
      <div className="min-h-[20rem] p-5 pb-0 flex flex-col gap-5 ">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-center gap-5 items-center ">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-xl md:text-2xl font-bold capitalize">
                {t("help")}
              </h1>
              <h1 className="text-sm md:text-lg font-bold capitalize text-mainBlack/50">
                {t("support")}
              </h1>
            </div>
            <div className="flex flex-wrap gap-5 justify-center items-center">
              <IconCard
                icon={<TfiEmail className="text-lg md:text-xl" />}
                topText={t("email")}
                mainText="store@farida.com"
              />
              <IconCard
                icon={<TfiHeadphone className="text-lg md:text-xl" />}
                topText={t("phone")}
                mainText="01089953368"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 justify-center items-center">
            <div className="w-full flex gap-5 justify-center items-center">
              <Image src="/apple.png" alt="" className="appDownload-image" />

              <Image src="/google.png" alt="" className="appDownload-image" />
            </div>
            <div className="flex items-center gap-3">
              <Icon
                icon={<FaFacebookF />}
                backColor="mainBlack"
                color="mainWhite"
                className="bg-mainBlack p-1"
              />
              <Icon
                icon={<FaInstagram />}
                backColor="mainBlack"
                color="mainWhite"
                className="bg-mainBlack text-mainWhite p-1"
              />
              <Icon
                icon={<FaTwitter />}
                backColor="mainBlack"
                color="mainWhite"
                className="bg-mainBlack text-mainWhite p-1"
              />
              <Icon
                icon={<FaLinkedin />}
                backColor="mainBlack"
                color="mainWhite"
                className="bg-mainBlack text-mainWhite p-1"
              />
            </div>
          </div>

          <div className=" flex flex-wrap gap-3 justify-center md:justify-between items-center">
            <h1 className="text-center text-mainBlack/50 text-sm">
              {t("copyrights")}
            </h1>

            <div className=" flex gap-5 items-center justify-center">
              <Image
                src="/MasterCard_Logo.svg.webp"
                alt=""
                className="payment-image"
              />
              <Image
                src="/Visa_Inc._logo.svg.png"
                alt=""
                className="payment-image"
              />
              <Image src="/PayPal.svg.png" alt="" className="payment-image" />
              <Image src="/cod-en.svg" alt="" className="payment-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
