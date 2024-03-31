import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("credentials");

  if (req.nextUrl.pathname.endsWith("/product")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token) {
    if (
      req.nextUrl.pathname.includes("/login") ||
      req.nextUrl.pathname.includes("/register")
    ) {
      return NextResponse.redirect(new URL("/user", req.url));
    }

    // if (
    //   req.nextUrl.pathname.includes("/confirmation") &&
    //   !req.nextUrl.searchParams.get("order_number")
    // ) {
    //   return NextResponse.redirect(new URL("/cart/shipping", req.url));
    // }
  }

  if (!token) {
    if (req.nextUrl.pathname.includes("/user")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
      req.nextUrl.pathname.includes("/confirmation") ||
      req.nextUrl.pathname.includes("/shipping")
    ) {
      return NextResponse.redirect(new URL("/cart", req.url));
    }
    if (
      req.nextUrl.pathname.includes("/order") ||
      req.nextUrl.pathname.includes("/trackorder")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  NextResponse.next();
  return intlMiddleware(req);
}

// middleware made by next-intl library

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "ar"],

  // Used when no locale matches
  defaultLocale: "en",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ar)/:path*"],
};
