"use client";

import { createContext } from "react";
import { store } from "@/stores";

export const StoreContext = createContext(store);
