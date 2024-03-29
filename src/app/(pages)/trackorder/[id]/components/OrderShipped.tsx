"use client";
import { Image, Progress } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { useScreenSize } from "react-screen-size-helper";

interface orderShippedProps {
  orderedDate: Date;
  arrivedDate: Date;

  status: "completed" | "in progress" | "on hold";
}

const OrderShipped = ({
  orderedDate,
  arrivedDate,

  status,
}: orderShippedProps) => {
  const today = new Date();
  const { currentWidth } = useScreenSize({});

  const [progress, setProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState("0");

  const calculateProgress = () => {
    if (arrivedDate.getFullYear() !== 1970) {
      let difDaysBetweenArrivedAndOrder = 0;
      let difDaysBetweenTodayAndOrder = 0;
      let progress = 0;
      let daysLeft = 0;
      let daysLeftParsed = 0;

      const difBetweenArrivedAndOrderInMs =
        arrivedDate.getTime() - orderedDate.getTime();
      const difBetweenTodayAndOrderInMs =
        today.getTime() - orderedDate.getTime();

      difDaysBetweenArrivedAndOrder =
        difBetweenArrivedAndOrderInMs / (1000 * 24 * 60 * 60);
      difDaysBetweenTodayAndOrder =
        difBetweenTodayAndOrderInMs / (1000 * 24 * 60 * 60);

      progress =
        (difDaysBetweenTodayAndOrder / difDaysBetweenArrivedAndOrder) * 100;

      daysLeft = difDaysBetweenArrivedAndOrder - difDaysBetweenTodayAndOrder;

      daysLeftParsed = Number.parseInt(`${daysLeft}`);

      if (progress <= 100 && progress >= 0) {
        setProgress(progress);
      } else {
        setProgress(100);
      }

      if (daysLeft > 1) {
        setDaysLeft(`${daysLeftParsed} days left`);
      } else if (daysLeft > 0 && daysLeft < 1) {
        setDaysLeft(`few hours left`);
      } else {
        setDaysLeft(`delivered successfully`);
      }

      if (status === "completed") {
        setProgress(100);
        setDaysLeft(`delivered successfully`);
      }
      if (status === "on hold") {
        setProgress(0);
        setDaysLeft(``);
      }
    } else {
      setProgress(0);
      setDaysLeft("");
    }
  };

  useEffect(() => {
    calculateProgress();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivedDate, orderedDate]);

  return (
    <div
      className={`${status === "in progress" && `scale-105 md:scale-110`} ${
        status !== "in progress" && `opacity-50`
      } transition-all w-full grid grid-rows-[auto_auto] grid-cols-1 md:grid-rows-1 md:grid-cols-[6fr_1fr] items-center bg-mainWhite shadow-md border-2 border-mainGray border-solid  p-5 rounded-md gap-y-3`}
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex items-center gap-1">
            <h1
              className={`capitalize font-bold text-sm md:text-xl ${
                status === "in progress" ? `text-emerald-500` : ``
              }`}
            >
              {status}
            </h1>
            {status === "completed" && (
              <RiCheckboxCircleFill className="text-emerald-500" />
            )}
          </div>

          <h2 className="capitalize font-bold text-lg md:text-2xl">
            2. order on the way{" "}
          </h2>
        </div>
        <div>
          <h3 className="capitalize font-semibold text-xs md:text-lg">
            your order was shipped successfully
          </h3>
          <h3 className="capitalize text-xs md:text-lg">
            it should be delivered at
          </h3>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center gap-2">
            <p className="font-bold text-xs md:text-sm">
              {orderedDate.toLocaleDateString("en", {
                day: "2-digit",
                weekday: "long",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="font-bold capitalize text-xs hidden md:block md:text-sm">
              {daysLeft}
            </p>
            <p className="font-bold text-xs hidden md:block md:text-sm">
              {arrivedDate.getFullYear() !== 1970
                ? arrivedDate.toLocaleDateString("en", {
                    day: "2-digit",
                    weekday: "long",
                    month: "short",
                    year: "numeric",
                  })
                : "soon"}
            </p>
          </div>

          <Progress
            aria-label="Loading..."
            value={progress}
            size={currentWidth > 768 ? "lg" : "md"}
            radius="none"
            placeholder="progress of the order"
            className="w-full  "
            classNames={{
              indicator: "bg-gradient-to-r from-mainPink to-mainPink",
            }}
          />

          <div className="flex md:hidden justify-between items-center gap-2">
            <p className="font-bold text-xs md:text-sm">
              {arrivedDate.getFullYear() !== 1970
                ? arrivedDate.toLocaleDateString("en", {
                    day: "2-digit",
                    weekday: "long",
                    month: "short",
                    year: "numeric",
                  })
                : "soon"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-1/4 justify-self-center md:w-full flex justify-center items-center">
          <Image
            src="/delivery-truck.png"
            alt=""
            radius="none"
            className="w-full h-full flex justify-center items-center z-[1]"
            classNames={{ img: "w-full h-full object-contain" }}
          />
        </div>
        <div
          className={`p-2 h-full aspect-square flex flex-col gap-y-1 ${
            daysLeft === "delivered successfully" &&
            "bg-emerald-600 text-mainWhite"
          } justify-center items-center shadow-sm	md:hidden border-solid border-1 border-mainBlack/25 rounded-md `}
        >
          <p className="text-sm font-bold capitalize">
            {daysLeft === "delivered successfully" ? "done" : daysLeft}
          </p>
          <p className="text-xs text-mainBlack/50 capitalize">
            {daysLeft !== "few hours left" &&
              daysLeft !== "delivered successfully" &&
              "days"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderShipped;
