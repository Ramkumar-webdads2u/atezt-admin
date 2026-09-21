export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export const setAuthCookies = (accessToken: string, refreshToken?: string) => {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(accessToken)}; path=/; SameSite=Lax`;

  if (refreshToken) {
    document.cookie = `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(refreshToken)}; path=/; SameSite=Lax`;
  }
};

export const getAccessToken = (): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");

  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith(`${ACCESS_TOKEN_COOKIE}=`),
  );

  if (!tokenCookie) {
    return null;
  }

  return decodeURIComponent(
    tokenCookie.substring(`${ACCESS_TOKEN_COOKIE}=`.length),
  );
};

export const getRefreshToken = (): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");

  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith(`${REFRESH_TOKEN_COOKIE}=`),
  );

  if (!tokenCookie) {
    return null;
  }

  return decodeURIComponent(
    tokenCookie.substring(`${REFRESH_TOKEN_COOKIE}=`.length),
  );
};

export const clearAuthCookies = () => {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0`;

  document.cookie = `${REFRESH_TOKEN_COOKIE}=; path=/; max-age=0`;
};
