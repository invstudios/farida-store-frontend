"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { SlSocialDropbox } from "react-icons/sl";
import { useScreenSize } from "react-screen-size-helper";

const EmptyOrderTrack = () => {
  const { currentWidth } = useScreenSize({});
  const router = useRouter();

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 py-10">
      <SlSocialDropbox className="text-9xl md:text-[12rem] text-mainBlack/25" />
      <h1 className="capitalize text-lg md:text-xl text-center">
        no order with this number
      </h1>
      <Button
        size={currentWidth > 768 ? "lg" : "md"}
        radius="none"
        className="bg-mainWhite text-mainBlack border-1 border-mainBlack border-solid text-lg md:text-xl capitalize"
        onClick={goToHome}
      >
        make an order
      </Button>
    </div>
  );
};

export default EmptyOrderTrack;
