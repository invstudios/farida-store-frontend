import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("credentials");
  const nextLocale = req.cookies.get("NEXT_LOCALE");

  if (req.nextUrl.pathname.endsWith("/product")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token) {
    if (
      req.nextUrl.pathname.includes("/login") ||
      req.nextUrl.pathname.includes("/register")
    ) {
      return NextResponse.redirect(
        new URL(`/${nextLocale ? nextLocale.value : `en`}/user`, req.url)
      );
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
      return NextResponse.redirect(
        new URL(`/${nextLocale ? nextLocale.value : `en`}/login`, req.url)
      );
    }

    if (
      req.nextUrl.pathname.includes("/confirmation") ||
      req.nextUrl.pathname.includes("/shipping")
    ) {
      return NextResponse.redirect(
        new URL(`/${nextLocale ? nextLocale.value : `en`}/cart`, req.url)
      );
    }
    if (
      req.nextUrl.pathname.includes("/order") ||
      req.nextUrl.pathname.includes("/trackorder")
    ) {
      return NextResponse.redirect(
        new URL(`/${nextLocale ? nextLocale.value : `en`}/login`, req.url)
      );
    }
  }

  // middleware made by next-intl library

  const handleI18nRouting = createMiddleware({
    // A list of all locales that are supported
    defaultLocale: "en",
    localePrefix,
    locales,
    // Used when no locale matches
  });

  const response = handleI18nRouting(req);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ar)/:path*"],
};
