import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/config";

const defaultLocale = "en";

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("access_token")?.value;

  const locale =
    locales.find(
      (item) => pathname === `/${item}` || pathname.startsWith(`/${item}/`),
    ) || defaultLocale;

  const pathnameWithoutLocale =
    pathname === `/${locale}`
      ? "/"
      : pathname.startsWith(`/${locale}/`)
        ? pathname.slice(locale.length + 1) || "/"
        : pathname;

  const isLoginPage =
    pathnameWithoutLocale === "/" ||
    pathnameWithoutLocale === "/auth/login";

  const isNetworkError =
    pathnameWithoutLocale.startsWith("/network-error");

  // Server-side protection: an authenticated user cannot go back
  // to the login page.
  if (accessToken && isLoginPage && !isNetworkError) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  // Unauthenticated users cannot open protected application routes.
  if (
    !accessToken &&
    !isLoginPage &&
    !isNetworkError &&
    pathnameWithoutLocale !== "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
  });

  const response = handleI18nRouting(request);
  response.headers.set("nextcode-locale", locale);

  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
