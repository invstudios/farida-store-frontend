"use client";
import { Avatar, Skeleton } from "@nextui-org/react";
import React from "react";

import { FaUserLarge } from "react-icons/fa6";

import Rating from "@/components/Rating";
import { useScreenSize } from "react-screen-size-helper";

interface userProps {
  id?: number;
  name: string;
  date?: Date;
  rating: number;
  review: string;
  userAvatar?: string;
}

const UserReview = ({
  id,
  name,
  date,
  rating,
  review,
  userAvatar,
}: userProps) => {
  const formattedDate = new Date(date ?? "").toLocaleDateString();

  const { currentWidth } = useScreenSize({});

  return (
    <div>
      <div className="grid grid-cols-[1fr_10fr] gap-2  items-start">
        <div className="flex flex-col gap-3">
          <Avatar
            icon={<FaUserLarge />}
            src={userAvatar ? userAvatar : ""}
            showFallback
            name=""
            size={currentWidth > 768 ? "lg" : "sm"}
            classNames={{
              base: "bg-mainDarkBlue w-12 h-12 md:w-16 md:h-16",
              icon: "text-5xl md:text-6xl text-mainWhite pt-2",
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton isLoaded={name?.length !== 0} className="w-max">
            <div className="grid grid-rows-[auto_auto] md:grid-cols-[auto_auto] items-center gap-x-2">
              <h1 className="text-lg md:text-xl">{name}</h1>

              <h1 className="text-xs md:text-sm text-mainBlack/50">
                {formattedDate}
              </h1>
            </div>
          </Skeleton>
          <Skeleton isLoaded={rating !== 0} className="w-max">
            <Rating
              rating={rating}
              size={currentWidth > 768 ? "1.5rem" : "1rem"}
            />
          </Skeleton>

          <Skeleton isLoaded={review?.length !== 0} className="w-full">
            <h1 className="text-lg md:text-xl text-mainBlack/50 w-full">
              {review}
            </h1>
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default UserReview;
