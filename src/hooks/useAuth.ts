"use client";
import { useEffect, useState } from "react";
import { isUserLoggedIn } from "@/functions/credentials";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only check authentication on client side
    const checkAuth = () => {
      const loggedIn = !!isUserLoggedIn();
      setIsLoggedIn(loggedIn);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return { isLoggedIn, isLoading };
};
