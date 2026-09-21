// const ACCESS_TOKEN_COOKIE = "access_token";
// const REFRESH_TOKEN_COOKIE = "refresh_token";

// const getCookieOptions = (maxAge: number) =>
//   `Path=/; Max-Age=${maxAge}; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;

// const readCookie = (name: string): string | null => {
//   if (typeof document === "undefined") return null;

//   const match = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith(`${name}=`));

//   return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
// };

// const writeCookie = (name: string, value: string, maxAge: number) => {
//   if (typeof document === "undefined") return;

//   document.cookie = `${name}=${encodeURIComponent(value)}; ${getCookieOptions(maxAge)}`;
// };

// const removeCookie = (name: string) => {
//   if (typeof document === "undefined") return;

//   document.cookie = `${name}=; ${getCookieOptions(0)}`;
// };

// export const setAuthCookies = (
//   accessToken: string,
//   refreshToken?: string,
// ) => {
//   // Seven days. The backend should still enforce token expiry.
//   writeCookie(ACCESS_TOKEN_COOKIE, accessToken, 60 * 60 * 24 * 7);

//   if (refreshToken) {
//     writeCookie(REFRESH_TOKEN_COOKIE, refreshToken, 60 * 60 * 24 * 30);
//   }
// };

// export const getAccessToken = () => readCookie(ACCESS_TOKEN_COOKIE);

// export const getRefreshToken = () => readCookie(REFRESH_TOKEN_COOKIE);

// export const clearAuthCookies = () => {
//   removeCookie(ACCESS_TOKEN_COOKIE);
//   removeCookie(REFRESH_TOKEN_COOKIE);
// };

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

const getCookieOptions = (maxAge: number) => {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  return `Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return match
    ? decodeURIComponent(rowValue(match, name))
    : null;
};

const rowValue = (row: string, name: string) => {
  return row.slice(name.length + 1);
};

const writeCookie = (
  name: string,
  value: string,
  maxAge: number,
) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; ${getCookieOptions(maxAge)}`;
};

const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; ${getCookieOptions(0)}`;
};

export const setAuthCookies = (
  accessToken: string,
  refreshToken?: string,
) => {
  writeCookie(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    60 * 60 * 24 * 7,
  );

  if (refreshToken) {
    writeCookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      60 * 60 * 24 * 30,
    );
  }
};

export const getAccessToken = () =>
  readCookie(ACCESS_TOKEN_COOKIE);

export const getRefreshToken = () =>
  readCookie(REFRESH_TOKEN_COOKIE);

export const clearAuthCookies = () => {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
};