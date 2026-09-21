const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const APIURLS = {
  baseUrl: BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/",
  imageUrl: BASE_URL,
};

export const APPCONFIG = {
  name: "ATEZT - Admin Panel",
  appMode: process.env.NODE_ENV || "development",
};

export const APICONSTANT = {
  Login: "super-admin/login",
} as const;

export type APIKeys = keyof typeof APICONSTANT;
