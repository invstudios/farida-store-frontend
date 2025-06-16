"use client";
import React from "react";
import WishlistContent from "./WishlistContent";
import WishListFliters from "./WishListFliters";
import { Divider } from "@nextui-org/react";
import { useAuth } from "@/hooks/useAuth";
import LoginWarning from "./LoginWarning";

const WishListSections = () => {
  const { isLoggedIn, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {isLoggedIn ? (
        <div className="grid grid-rows-1 grid-cols-1 xl:grid-cols-[5fr_auto_1fr]  mt-10 px-1 sm:px-5 lg:px-10  xl:px-20 gap-10">
          <WishlistContent />
          <Divider orientation="vertical" className="hidden xl:block" />
          <WishListFliters />
        </div>
      ) : (
        <LoginWarning />
      )}
    </div>
  );
};

export default WishListSections;
